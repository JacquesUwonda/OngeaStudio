
import 'server-only';
import prisma from './prisma';
import { getSession } from './auth';

export async function getUser() {
  const session = await getSession();
  if (!session?.userId) {
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
