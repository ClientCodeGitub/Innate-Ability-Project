import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const getSchema = z.object({
  rid: z.coerce.number().int().positive(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ridRaw = searchParams.get("rid");

    const parsed = getSchema.safeParse({ rid: ridRaw });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid result id", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const rid = parsed.data.rid;

    const { data, error } = await supabaseAdmin
      .from("results")
      .select("id, answers, computed_result, unlocked, unlocked_at, created_at")
      .eq("id", rid)
      .single();

    if (error) {
      console.error("Database error (get result):", error);
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({ result: data });
  } catch (err) {
    console.error("Unexpected error in get route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
