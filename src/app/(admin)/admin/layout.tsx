import { AdminNav } from "@/components/layout/admin-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookHeart } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/admin" className="flex items-center gap-2">
                        <BookHeart className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-semibold font-headline">Ongea Admin</h1>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <AdminNav />
                </div>
            </header>
            <main className="flex flex-1 flex-col bg-muted/30">
                {children}
            </main>
        </div>
    );
}
