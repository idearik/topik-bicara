import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return new NextResponse(null, { status: 500 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new NextResponse(null, { status: 400 });
    }

    if (password === adminPassword) {
      // Create response with admin session cookie
      const response = new NextResponse(null, { status: 200 });
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return new NextResponse(null, { status: 401 });
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return new NextResponse(null, { status: 500 });
  }
} 