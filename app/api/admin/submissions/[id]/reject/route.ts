import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminSupabase } from '@/lib/supabase';

type Props = {
  params: {
    id: string;
  };
};

export async function POST(
  req: NextRequest,
  props: Props
): Promise<NextResponse> {
  try {
    const { id } = props.params;

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

    // Delete from submissions table
    const { error: deleteError } = await adminSupabase
      .from('question_submissions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting submission:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 