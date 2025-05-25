import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminSupabase } from '@/lib/supabase';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = context.params;
    
    // Check for admin session
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!adminSupabase) {
      console.error('Admin client not configured', {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 4) || 'not-set'
      });
      return NextResponse.json({ error: 'Admin client not configured' }, { status: 500 });
    }

    // Get the submission data
    const { data: submission, error: fetchError } = await adminSupabase
      .from('question_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching submission:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Insert into questions table
    const { data: insertedQuestion, error: insertError } = await adminSupabase
      .from('questions')
      .insert([
        {
          question: submission.question,
          topic: submission.topic,
          is_user_submitted: true,
          author_credit: submission.author_credit
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting question:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Delete from submissions table
    const { error: deleteError } = await adminSupabase
      .from('question_submissions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      // Try to rollback the question insert
      await adminSupabase
        .from('questions')
        .delete()
        .eq('id', insertedQuestion.id);
      
      console.error('Error deleting submission:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 