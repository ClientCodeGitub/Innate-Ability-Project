import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const emailSchema = z.object({
  rid: z.coerce.number().int().positive(), // ✅ accepts "25" or 25
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { rid, email } = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('results')
      .update({ email })
      .eq('id', rid) // ✅ id is numeric
      .select('id')
      .single();

    if (error || !data) {
      console.error('Database error (update email):', error);
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, rid: data.id });
  } catch (err) {
    console.error('Unexpected error in email route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
