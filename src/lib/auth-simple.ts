// FILE: lib/auth-simple.ts

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';

// This helper function ensures the secret is correctly encoded for the crypto operations.
function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Re-implemented with `jose` to be Edge Runtime compatible
export async function generateToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey());
}

// Re-implemented with `jose`
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as JWTPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

// This function becomes async because generateToken is now async
export async function createSessionSimple(userId: string): Promise<string> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const token = await generateToken({ userId: user.id, email: user.email });
  console.log('Creating simple session for user:', userId);
  
  return token;
}

// This function was already async, we just need to `await` the new verifyToken
export async function validateSessionSimple(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    console.log('Validating simple token (Edge-safe)...');
    
    const payload = await verifyToken(token);
    
    if (!payload) {
      console.log('Simple token verification failed');
      return null;
    }
    
    console.log('Simple token verified for user:', payload.userId);
    
    // The responsibility of checking if the user exists is now on the API routes
    // that consume this token, not on the middleware.
    
    return { userId: payload.userId, email: payload.email };
  } catch (error) {
    console.error('Simple session validation error:', error);
    return null;
  }
}