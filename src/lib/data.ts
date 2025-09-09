
import 'server-only';
import prisma from './prisma';
import { getSession } from './auth';

export async function getUser() {
  const session = await getSession();
  if (!session?.userId || session.isAdmin) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      return null;
    }

    return user;

  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function getAdmin() {
    const session = await getSession();
    if (!session?.userId || !session.isAdmin) {
        return null;
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: session.userId,
            },
        });

        if (!admin) {
            return null;
        }

        return admin;

    } catch (error) {
        console.error("Failed to fetch admin:", error);
        return null;
    }
}
