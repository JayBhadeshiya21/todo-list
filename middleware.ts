import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const admin = req.cookies.get('adminId');

  if (!admin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
