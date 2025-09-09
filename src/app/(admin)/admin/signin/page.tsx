
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSignInForm } from './signin-form';

export default async function AdminSignInPage() {
  const session = await getSession();

  // If an admin is already logged in, redirect them to the dashboard.
  if (session?.isAdmin) {
    redirect('/admin');
  }

  // Otherwise, show the sign-in form.
  return <AdminSignInForm />;
}
