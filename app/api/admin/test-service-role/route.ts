import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!adminSupabase) {
      return NextResponse.json({ error: 'Admin client not configured' }, { status: 500 });
    }

    // Test service role access
    const { data, error } = await adminSupabase
      .from('question_submissions')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: 'Failed to access question_submissions',
        details: error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      hasData: !!data,
      dataLength: data?.length || 0,
      firstItem: data?.[0]
    });
  } catch (e) {
    return NextResponse.json({
      error: 'Unexpected error',
      details: e
    }, { status: 500 });
  }
} 