import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

function verifySignature(rawBody: string, signature: string, secret: string) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody, 'utf8');
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Missing LEMONSQUEEZY_WEBHOOK_SECRET' }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get('X-Signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const isValid = verifySignature(rawBody, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name;

    // Handle one-time order events
    const paidEvents = ['order_created', 'order_paid', 'checkout_completed'];
    if (!paidEvents.includes(eventName)) {
      return NextResponse.json({ received: true });
    }

    const rid =
      payload?.meta?.custom_data?.rid ||
      payload?.data?.attributes?.custom_data?.rid ||
      payload?.data?.attributes?.checkout_data?.custom?.rid;

    if (!rid || typeof rid !== 'string') {
      return NextResponse.json({ received: true, error: 'Missing rid' });
    }

    const { error: updateError } = await supabaseAdmin
      .from('results')
      .update({
        unlocked: true,
        unlocked_at: new Date().toISOString(),
      })
      .eq('id', rid);

    if (updateError) {
      console.error('Database error (unlock result):', updateError);
      return NextResponse.json({ error: 'Failed to unlock result' }, { status: 500 });
    }

    return NextResponse.json({ received: true, unlocked: true });
  } catch (err) {
    console.error('Unexpected error in Lemon Squeezy webhook:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
