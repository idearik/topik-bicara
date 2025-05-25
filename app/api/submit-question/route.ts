import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, topic, author_credit } = body;

    // Basic validation
    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (!adminSupabase) {
      console.error('Admin client not configured', {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 4) || 'not-set'
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Insert the submission using admin client
    const { data, error } = await adminSupabase
      .from('question_submissions')
      .insert([
        {
          question: question.trim(),
          topic,
          author_credit: author_credit?.trim() || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error submitting question:', error);
      return NextResponse.json(
        { error: 'Failed to submit question' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 