
import { ThemeToggle } from '@/components/theme-toggle';
import { BookHeart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <Link href="/" className="flex items-center gap-2">
            <BookHeart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold font-headline">Ongea Admin</span>
        </Link>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Future admin user menu can go here */}
        </div>
      </header>
      {children}
    </div>
  );
}
