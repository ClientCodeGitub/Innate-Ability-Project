import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { computeResult } from '@/lib/scoring';
import { questions } from '@/lib/questions';

const createResultSchema = z.object({
  answers: z.record(z.union([z.string(), z.number(), z.array(z.string()), z.null()])),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createResultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { answers } = parsed.data;

    // Validate required questions
    const requiredQuestions = questions.filter(q => q.required);
    const missingQuestions = requiredQuestions.filter(q => {
      const answer = answers[q.id];
      return (
        answer === null ||
        answer === undefined ||
        (Array.isArray(answer) && answer.length === 0) ||
        (typeof answer === 'string' && answer.trim() === '')
      );
    });

    if (missingQuestions.length > 0) {
      return NextResponse.json(
        { error: 'Missing required answers', missing: missingQuestions.map(q => q.id) },
        { status: 400 }
      );
    }

    const computedResult = computeResult(answers);

    // Build insert object (locked by default until payment is completed)
    const insertPayload: any = {
      answers,
      computed_result: computedResult,
      unlocked: false,
      unlocked_at: null,
    };

    const { data, error } = await supabaseAdmin
      .from('results')
      .insert(insertPayload)
      .select('id')
      .single();

    if (error) {
      console.error('Database error (create result):', error);
      return NextResponse.json(
        { error: 'Failed to create result', supabase: error },
        { status: 500 }
      );
    }

    // IMPORTANT: log what we got
    console.log('Create result success:', data);

    if (!data?.id) {
      return NextResponse.json(
        { error: 'Created but missing id in response', data },
        { status: 500 }
      );
    }

    return NextResponse.json({ rid: data.id });
  } catch (err) {
    console.error('Unexpected error in create route:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
