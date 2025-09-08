
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminDashboard from './dashboard-client';

export default async function AdminDashboardPage() {
    const session = await getSession();

    if (!session?.isAdmin) {
        // If the user is not an admin, redirect them.
        // If they are a regular logged-in user, send them to their dashboard.
        // Otherwise, send them to the regular sign-in page.
        redirect(session?.userId ? '/dashboard' : '/signin');
    }

  return <AdminDashboard />;
}
