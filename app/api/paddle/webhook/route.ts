import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

// Paddle Classic webhook signature verification
// Documentation: https://developer.paddle.com/webhook-reference/verifying-webhooks
function verifyPaddleSignature(
  payload: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const verifier = crypto.createVerify('RSA-SHA1');
    verifier.update(payload);
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    // Paddle Classic may send signature in header or in payload
    // Try header first, then check payload
    let signature = request.headers.get('paddle-signature') || 
                    request.headers.get('X-Paddle-Signature');
    
    // If not in header, try to extract from payload (some Paddle versions)
    if (!signature) {
      try {
        const payload = JSON.parse(rawBody);
        signature = payload.p_signature || payload.signature;
      } catch (e) {
        // Continue without signature from payload
      }
    }

    if (!signature) {
      console.error('Missing Paddle signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const publicKey = process.env.PADDLE_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Missing PADDLE_PUBLIC_KEY');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Paddle sends signature as base64, verify it
    const isValid = verifyPaddleSignature(rawBody, signature, publicKey);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    const eventType = payload.alert_name;

    // Handle successful payment events
    // Paddle Classic events: payment_succeeded, subscription_payment_succeeded
    const paymentSuccessEvents = [
      'payment_succeeded',
      'subscription_payment_succeeded',
    ];

    if (!paymentSuccessEvents.includes(eventType)) {
      // Not a payment success event, acknowledge but don't process
      return NextResponse.json({ received: true });
    }

    // Extract data from webhook
    const transactionId = payload.subscription_id || payload.subscription_payment_id || payload.order_id;
    const customerId = payload.user_id || payload.customer_id || null;
    
    // Extract passthrough data (contains rid)
    let rid: string | null = null;
    try {
      const passthrough = payload.passthrough;
      if (passthrough) {
        const parsed = typeof passthrough === 'string' ? JSON.parse(passthrough) : passthrough;
        rid = parsed.rid || null;
      }
    } catch (e) {
      console.error('Error parsing passthrough:', e);
    }

    if (!rid) {
      console.error('Missing rid in webhook payload');
      // Still return 200 to acknowledge webhook, but log error
      return NextResponse.json({ received: true, error: 'Missing rid' });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(rid)) {
      console.error('Invalid rid format in webhook');
      return NextResponse.json({ received: true, error: 'Invalid rid format' });
    }

    // Check if already unlocked (idempotency)
    const { data: existing } = await supabaseAdmin
      .from('results')
      .select('unlocked, paddle_transaction_id')
      .eq('id', rid)
      .single();

    if (existing?.unlocked && existing?.paddle_transaction_id === transactionId) {
      // Already processed this transaction, idempotent success
      return NextResponse.json({ received: true, alreadyUnlocked: true });
    }

    // Update database to unlock result
    const { error: updateError } = await supabaseAdmin
      .from('results')
      .update({
        unlocked: true,
        unlocked_at: new Date().toISOString(),
        paddle_transaction_id: transactionId,
        paddle_customer_id: customerId,
      })
      .eq('id', rid);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to unlock result' },
        { status: 500 }
      );
    }

    // Successfully unlocked
    return NextResponse.json({ received: true, unlocked: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 to prevent Paddle from retrying (we'll handle errors internally)
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

// Paddle webhooks can also be sent as GET for verification
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
