import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

function verifySignature(rawBody: string, signature: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("X-Signature");


    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("Lemon webhook received");

    const payload = JSON.parse(rawBody);
    const event = payload?.meta?.event_name;
    console.log("Lemon webhook event:", event);

    if (!["order_created", "order_paid", "checkout_completed"].includes(event)) {
      return NextResponse.json({ received: true });
    }

    const ridRaw =
      payload?.meta?.custom_data?.rid ||
      payload?.data?.attributes?.custom_data?.rid ||
      payload?.data?.attributes?.checkout_data?.custom?.rid;

    const rid = Number(ridRaw);
    if (!Number.isInteger(rid) || rid <= 0) {
      console.error("Invalid rid:", ridRaw);
      return NextResponse.json({ received: true });
    }
    console.log("Unlocking result id:", rid);

    const { error } = await supabaseAdmin
      .from("results")
      .update({
        is_paid: true,
        unlocked_at: new Date().toISOString(),
      })
      .eq("id", rid);

    if (error) {
      console.error("Supabase unlock error:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook crash:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
