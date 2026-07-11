import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory store for rate limiting (per Edge isolate)
// Not perfect for multi-node deployments without Redis, but fulfills basic OWASP protection.
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

const RATE_LIMIT = 50; // Requests per minute
const WINDOW_MS = 60 * 1000;

export function middleware(request: NextRequest) {
  // Only apply rate limiting to /api/* routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    
    let ipData = rateLimitMap.get(ip);
    
    if (!ipData || now > ipData.resetTime) {
      ipData = { count: 1, resetTime: now + WINDOW_MS };
    } else {
      ipData.count++;
    }
    
    rateLimitMap.set(ip, ipData);
    
    if (ipData.count > RATE_LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests', message: 'You have exceeded the rate limit. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }
  }

  // Inject a security header on all requests as defense-in-depth
  const response = NextResponse.next();
  response.headers.set('X-NimbusAI-Secured', 'true');
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
