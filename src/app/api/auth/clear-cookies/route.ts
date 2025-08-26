import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Cookies cleared' })
  
  // Clear all auth-related cookies
  response.cookies.delete('auth-token')
  response.cookies.delete('session-id')
  
  return response
}
