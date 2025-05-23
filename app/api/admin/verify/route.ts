import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminPassword || !adminEmail) {
      console.error('ADMIN_PASSWORD or ADMIN_EMAIL environment variable is not set');
      return new NextResponse(null, { status: 500 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new NextResponse(null, { status: 400 });
    }

    if (password === adminPassword) {
      // Sign in with Supabase using admin credentials
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error) {
        console.error('Error signing in with Supabase:', error);
        return new NextResponse(null, { status: 401 });
      }

      return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 401 });
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return new NextResponse(null, { status: 500 });
  }
} 