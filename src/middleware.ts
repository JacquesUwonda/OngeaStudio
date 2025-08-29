import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSessionSimple } from '@/lib/auth-simple'
import { validateAdminSessionSimple } from '@/lib/admin-auth'

// Routes that require standard user authentication
const protectedUserRoutes = [
  '/dashboard',
  '/stories',
  '/flashcards',
  '/chat',
  '/scenarios',
]

// Routes that require admin authentication
const protectedAdminRoutes = [
  '/admin'
]

// Auth pages for standard users
const userRoutes = [
  '/signin',
  '/signup',
]

// Auth pages for admins
const adminAuthRoutes = [
  '/admin/signin'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userToken = request.cookies.get('auth-token')?.value
  const adminToken = request.cookies.get('admin-auth-token')?.value

  // Admin route protection
  if (protectedAdminRoutes.some(route => pathname.startsWith(route)) && pathname !== '/admin/signin') {
    let isAdminAuthenticated = false
    if (adminToken) {
      const adminSession = await validateAdminSessionSimple(adminToken)
      isAdminAuthenticated = !!adminSession
    }
    
    if (!isAdminAuthenticated) {
      return NextResponse.redirect(new URL('/admin/signin', request.url))
    }
  }
  
  // If trying to access admin signin page while already logged in as admin, redirect to admin dashboard
  if (pathname.startsWith('/admin/signin')) {
    if (adminToken) {
      const adminSession = await validateAdminSessionSimple(adminToken);
      if (adminSession) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }


  // User route protection
  let isUserAuthenticated = false
  if (userToken) {
    const userSession = await validateSessionSimple(userToken)
    isUserAuthenticated = !!userSession
  }

  // Redirect authenticated admins away from admin signin page
  if (!!adminToken && adminAuthRoutes.some(route => pathname.startsWith(route))) {
    // This logic is partially duplicated above but is fine.
    // It is better to have explicit checks.
    const adminSession = await validateAdminSessionSimple(adminToken);
      if (adminSession) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
  }

  // Redirect authenticated users away from user auth pages
  if (isUserAuthenticated && userRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to signin for protected user routes
  if (!isUserAuthenticated && protectedUserRoutes.some(route => pathname.startsWith(route))) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
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
