
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminDashboard from './dashboard-client';

export default async function AdminDashboardPage() {
    const session = await getSession();

    // If there is no session or the user is not an admin, redirect.
    if (!session?.isAdmin) {
        // If a regular user is logged in, send them to their dashboard.
        if (session?.userId) {
            redirect('/dashboard');
        }
        // Otherwise (no one is logged in), send them to the admin sign-in page.
        redirect('/admin/signin');
    }

  return <AdminDashboard />;
}
