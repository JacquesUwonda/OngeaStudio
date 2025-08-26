import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface JWTPayload {
  userId: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const token = generateToken({ userId: user.id, email: user.email })
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  console.log('Creating session for user:', userId, 'with token:', token.substring(0, 20) + '...')

  const session = await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  console.log('Session created with ID:', session.id)
  return token
}

export async function validateSession(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    console.log('Validating token:', token.substring(0, 20) + '...')

    const payload = verifyToken(token)
    if (!payload) {
      console.log('Token verification failed')
      return null
    }
    console.log('Token verified for user:', payload.userId)

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    })

    console.log('Session found:', !!session)
    if (session) {
      console.log('Session expires at:', session.expiresAt, 'Current time:', new Date())
    }

    if (!session || session.expiresAt < new Date()) {
      console.log('Session expired or not found')
      // Clean up expired session
      if (session) {
        await db.session.delete({ where: { id: session.id } })
      }
      return null
    }

    console.log('Session valid for user:', session.user.email)
    return { userId: session.user.id, email: session.user.email }
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  await db.session.deleteMany({ where: { token } })
}
