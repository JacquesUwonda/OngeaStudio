import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword, createSessionSimple } from '@/lib/auth-simple'
import { AnalyticsService } from '@/lib/analytics'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  spokenLanguage: z.string().optional().default('en'),
  learningLanguage: z.string().optional().default('fr'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, spokenLanguage, learningLanguage } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        spokenLanguage,
        learningLanguage,
      },
    })

    // Create session
    const token = await createSessionSimple(user.id)

    // Track signup event
    await AnalyticsService.trackUserAction(
      'user_signup',
      '/signup',
      user.id,
      undefined,
      {
        spokenLanguage,
        learningLanguage,
        signupMethod: 'email',
      }
    )

    // Set cookie and return success
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          spokenLanguage: user.spokenLanguage,
          learningLanguage: user.learningLanguage,
        },
      },
      { status: 201 }
    )

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/', // Ensure cookie is available for all paths
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
