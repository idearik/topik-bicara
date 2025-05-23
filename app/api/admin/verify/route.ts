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
      return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 401 });
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return new NextResponse(null, { status: 500 });
  }
} 