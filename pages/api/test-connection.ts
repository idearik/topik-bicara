import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test the connection
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: error,
        config: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      });
    }

    return res.status(200).json({
      success: true,
      count,
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (e) {
    return res.status(500).json({
      error: 'Unexpected error',
      details: e
    });
  }
} 