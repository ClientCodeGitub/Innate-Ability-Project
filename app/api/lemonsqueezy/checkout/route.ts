import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const checkoutSchema = z.object({
  rid: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { rid } = parsed.data;
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!apiKey || !storeId || !variantId || !baseUrl) {
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                rid,
              },
            },
            checkout_options: {
              redirect_url: `${baseUrl}/results?rid=${encodeURIComponent(rid)}`,
            },
          },
          relationships: {
            store: {
              data: { type: 'stores', id: storeId },
            },
            variant: {
              data: { type: 'variants', id: variantId },
            },
          },
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Lemon Squeezy checkout error:', data);
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }

    const checkoutUrl = data?.data?.attributes?.url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: 'Checkout URL missing' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error('Unexpected error in Lemon Squeezy checkout:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
