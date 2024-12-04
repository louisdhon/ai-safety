import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for required environment variables
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey && request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  // Validate Content-Type for audio uploads
  if (request.nextUrl.pathname === '/api/upload') {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }
  }

  // Add security headers
  const headers = new Headers(request.headers);
  
  // Security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'microphone=self');

  // Return response with added headers
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};