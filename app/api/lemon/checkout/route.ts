import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkoutSchema = z.object({
  // ✅ your results "id" is a number (25, 26, 27...)
  rid: z.coerce.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { rid } = parsed.data;

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;     // must be a string like "12345"
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID; // must be a string like "98765"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;      // during dev: your ngrok url

    if (!apiKey || !storeId || !variantId || !baseUrl) {
      return NextResponse.json(
        { error: "Payment configuration error (missing env vars)" },
        { status: 500 }
      );
    }

    // ✅ redirect after successful purchase
    const redirectUrl = `${baseUrl}/results?rid=${encodeURIComponent(String(rid))}`;

    const lsRes = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            // ✅ correct place for redirect_url is product_options (not checkout_options)
            product_options: {
              redirect_url: redirectUrl,
              // Optional: keep only one variant visible
              enabled_variants: [Number(variantId)],
            },

            // ✅ attach your rid so webhook can unlock the right result later
            checkout_data: {
              custom: {
                rid: String(rid),
              },
            },

            // Optional UI tweaks (doesn't fully "custom design", but helps)
            checkout_options: {
              logo: true,
              media: true,
              desc: true,
              discount: true,
            },

            // Optional: set test_mode from env if you want
            test_mode: process.env.LEMONSQUEEZY_TEST_MODE === "true",
          },
          relationships: {
            store: { data: { type: "stores", id: String(storeId) } },
            variant: { data: { type: "variants", id: String(variantId) } },
          },
        },
      }),
    });

    const lsData = await lsRes.json().catch(() => null);

    if (!lsRes.ok) {
      console.error("Lemon Squeezy checkout error:", {
        status: lsRes.status,
        statusText: lsRes.statusText,
        body: lsData,
      });

      return NextResponse.json(
        { error: "Failed to create checkout", details: lsData },
        { status: 500 }
      );
    }

    const checkoutUrl = lsData?.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error("Lemon Squeezy: checkout URL missing:", lsData);
      return NextResponse.json({ error: "Checkout URL missing" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("Unexpected error in Lemon Squeezy checkout:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
