// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    mongoUri: process.env.MONGODB_URI ? 'Set (' + process.env.MONGODB_URI.substring(0, 20) + '...)' : 'Not set',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    timestamp: new Date().toISOString(),
    netlify: process.env.NETLIFY ? 'Yes' : 'No'
  });
}
