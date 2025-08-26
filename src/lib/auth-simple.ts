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

// Simplified session creation - just return the JWT token
export async function createSessionSimple(userId: string): Promise<string> {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const token = generateToken({ userId: user.id, email: user.email })
  console.log('Creating simple session for user:', userId)
  
  return token
}

// Simplified validation - just verify the JWT token
export async function validateSessionSimple(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    console.log('Validating simple token:', token.substring(0, 20) + '...')
    
    const payload = verifyToken(token)
    if (!payload) {
      console.log('Simple token verification failed')
      return null
    }
    
    console.log('Simple token verified for user:', payload.userId)
    
    // Verify user still exists
    const user = await db.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      console.log('User no longer exists')
      return null
    }
    
    console.log('Simple session valid for user:', user.email)
    return { userId: user.id, email: user.email }
  } catch (error) {
    console.error('Simple session validation error:', error)
    return null
  }
}
