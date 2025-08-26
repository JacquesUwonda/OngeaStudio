import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSession } from '@/lib/auth'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/stories',
  '/flashcards',
  '/chat',
  '/admin',
]

// Routes that should redirect to dashboard if user is authenticated
const authRoutes = [
  '/signin',
  '/signup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Check if user is authenticated
  let isAuthenticated = false
  let userId: string | undefined

  if (token) {
    try {
      const session = await validateSession(token)
      isAuthenticated = !!session
      userId = session?.userId
      console.log(`Middleware: Token found, authenticated: ${isAuthenticated}, path: ${pathname}`)
    } catch (error) {
      console.error('Middleware: Session validation failed:', error)
      isAuthenticated = false
    }
  } else {
    console.log(`Middleware: No token found for path: ${pathname}`)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to signin for protected routes
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Track page views for analytics (async, don't wait)
  if (process.env.ANALYTICS_ENABLED === 'true') {
    // Generate a session ID for anonymous users
    const sessionId = request.cookies.get('session-id')?.value || 
                     crypto.randomUUID()

    // Track page view asynchronously
    trackPageView(pathname, userId, sessionId, request)
      .catch(error => console.error('Failed to track page view:', error))

    // Set session ID cookie for anonymous users
    if (!request.cookies.get('session-id')?.value) {
      const response = NextResponse.next()
      response.cookies.set('session-id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })
      return response
    }
  }

  return NextResponse.next()
}

async function trackPageView(
  pathname: string, 
  userId?: string, 
  sessionId?: string,
  request?: NextRequest
) {
  try {
    // Only track certain pages to avoid noise
    const trackablePages = [
      '/',
      '/dashboard',
      '/stories',
      '/flashcards', 
      '/chat',
      '/signin',
      '/signup',
    ]

    const shouldTrack = trackablePages.some(page => 
      pathname === page || pathname.startsWith(page + '/')
    )

    if (!shouldTrack) return

    // Make internal API call to track the event
    const baseUrl = request?.nextUrl.origin || process.env.NEXTAUTH_URL || 'http://localhost:9002'
    
    await fetch(`${baseUrl}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request?.headers.get('user-agent') || 'Unknown',
        'X-Forwarded-For': request?.headers.get('x-forwarded-for') || '',
      },
      body: JSON.stringify({
        eventType: 'page_view',
        eventName: 'page_view',
        page: pathname,
        sessionId,
        properties: {
          referrer: request?.headers.get('referer'),
          userAgent: request?.headers.get('user-agent'),
        },
      }),
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
