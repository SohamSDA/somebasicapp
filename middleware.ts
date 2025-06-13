import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // 🔒 You can still add logging or monitoring here if needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};