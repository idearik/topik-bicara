import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    // Only show first few chars for verification
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 4) || 'not-set',
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
} 