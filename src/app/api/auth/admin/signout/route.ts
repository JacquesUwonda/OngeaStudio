
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Admin signed out successfully' },
      { status: 200 }
    )

    // Clear the admin-specific cookie
    response.cookies.delete('admin-auth-token')

    return response
  } catch (error) {
    console.error('Admin signout error:', error)
    
    // Even if there's an error, try to clear the cookie
    const response = NextResponse.json(
      { success: true, message: 'Signed out' },
      { status: 200 }
    )
    response.cookies.delete('admin-auth-token')
    return response
  }
}
