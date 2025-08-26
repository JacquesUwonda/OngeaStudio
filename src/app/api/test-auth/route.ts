import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    console.log('Test Auth - Token found:', !!token)
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: 'No token found'
      })
    }

    const session = await validateSession(token)
    console.log('Test Auth - Session valid:', !!session)
    
    if (session) {
      return NextResponse.json({
        authenticated: true,
        userId: session.userId,
        email: session.email
      })
    } else {
      return NextResponse.json({
        authenticated: false,
        message: 'Invalid session'
      })
    }
  } catch (error) {
    console.error('Test Auth Error:', error)
    return NextResponse.json({
      authenticated: false,
      error: error.message
    })
  }
}
