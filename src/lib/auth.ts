
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

interface SessionPayload {
    userId: string;
    expiresAt: Date;
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d') // Set session to expire in 1 day
        .sign(key);
}

export async function decrypt(session: string | undefined = '') {
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload;
    } catch (error) {
        console.error('Failed to verify session:', error);
        return null;
    }
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
    const session = await encrypt({ userId, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;
    const session = await decrypt(cookie);
    return session;
}

export async function updateSession() {
    const session = await getSession();
    if (!session) return;

    // Refresh the session so it expires 1 day from now
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newSession = await encrypt({ userId: session.userId, expiresAt: newExpiresAt });
    
    const cookieStore = await cookies();
    cookieStore.set('session', newSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: newExpiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/signin');
}
