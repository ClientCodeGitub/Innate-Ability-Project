import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const checkoutSchema = z.object({
  rid: z.string().uuid(),
});

// Using Paddle Classic API for one-time payments
// Documentation: https://developer.paddle.com/api-reference/overview
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rid } = checkoutSchema.parse(body);

    const vendorId = process.env.PADDLE_VENDOR_ID;
    const vendorAuthCode = process.env.PADDLE_API_KEY;
    const productId = process.env.PADDLE_PRODUCT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!vendorId || !vendorAuthCode || !productId || !baseUrl) {
      console.error('Missing Paddle environment variables');
      return NextResponse.json(
        { error: 'Payment configuration error' },
        { status: 500 }
      );
    }

    // Create Paddle checkout URL
    // Using Paddle Classic Generate method
    const paddleUrl = 'https://vendors.paddle.com/api/2.0/product/generate_pay_link';

    const formData = new URLSearchParams();
    formData.append('vendor_id', vendorId);
    formData.append('vendor_auth_code', vendorAuthCode);
    formData.append('product_id', productId);
    formData.append('passthrough', JSON.stringify({ rid })); // Pass rid through to webhook
    formData.append('success_url', `${baseUrl}/unlock/success?rid=${rid}`);
    formData.append('prices[0]', 'USD:19.00'); // $19 one-time payment

    const response = await fetch(paddleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.response?.url) {
      console.error('Paddle checkout error:', data);
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.response.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
