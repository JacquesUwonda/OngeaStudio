import { NextRequest, NextResponse } from 'next/server'
// import { deleteSession } from '@/lib/auth'
import { AnalyticsService } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (token) {
      // Track signout event before deleting session
      await AnalyticsService.trackUserAction(
        'user_signout',
        request.nextUrl.pathname,
        undefined,
        undefined,
        {
          signoutMethod: 'manual',
        }
      )

      // Delete session from database
      // await deleteSession(token)
    }

    // Clear cookie
    const response = NextResponse.json(
      { success: true, message: 'Signed out successfully' },
      { status: 200 }
    )

    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Signout error:', error)
    
    // Even if there's an error, clear the cookie
    const response = NextResponse.json(
      { success: true, message: 'Signed out' },
      { status: 200 }
    )

    response.cookies.delete('auth-token')
    return response
  }
}
