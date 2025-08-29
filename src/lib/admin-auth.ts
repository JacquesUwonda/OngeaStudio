import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET);

export interface AdminJWTPayload {
  adminId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function generateAdminToken(payload: AdminJWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Admins have shorter sessions
    .sign(JWT_SECRET_BYTES);
}

export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
    return payload as AdminJWTPayload;
  } catch (error) {
    return null;
  }
}

export async function createAdminSession(adminId: string): Promise<string> {
  const admin = await db.admin.findUnique({ where: { id: adminId } });
  if (!admin) throw new Error('Admin not found');

  const token = await generateAdminToken({ adminId: admin.id, email: admin.email });
  return token;
}

export async function validateAdminSession(token: string): Promise<{ adminId: string; email: string } | null> {
  try {
    const payload = await verifyAdminToken(token);
    if (!payload) return null;

    // Optional: Add a check to ensure the admin still exists, for added security
    const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
    if (!admin) return null;

    return { adminId: payload.adminId, email: payload.email };
  } catch (error) {
    console.error('Admin session validation error:', error);
    return null;
  }
}

// Edge-safe version for middleware
export async function validateAdminSessionSimple(token: string): Promise<{ adminId: string; email: string } | null> {
    try {
        const payload = await verifyAdminToken(token);
        if (!payload || !payload.adminId) {
            return null;
        }
        return { adminId: payload.adminId, email: payload.email };
    } catch (error) {
        console.error('Simple admin session validation error:', error);
        return null;
    }
}
