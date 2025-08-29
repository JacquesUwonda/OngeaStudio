import React from 'react';

// This layout ensures that the admin section does not inherit the main app layout.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
