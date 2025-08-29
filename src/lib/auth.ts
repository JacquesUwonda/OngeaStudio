// FILE: lib/auth.ts

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

// Re-implemented with `jose`
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
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const token = await generateToken({ userId: user.id, email: user.email });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
  
  return token;
}

export async function validateSession(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }
    
    // In a stateful system, you *might* want to hit the DB here.
    // But to keep it simple and Edge-compatible for middleware use,
    // we only validate the token. A separate API route would validate
    // the session against the database.
    // For now, let's make it symmetric with auth-simple.
    
    return { userId: payload.userId, email: payload.email };

  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}