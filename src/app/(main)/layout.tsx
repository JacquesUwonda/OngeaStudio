import AppLayout from "@/components/layout/app-layout";
import { UserNav } from "@/components/layout/user-nav";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppLayout 
            userNav={
                <Suspense fallback={<Skeleton className="h-9 w-9 rounded-full" />}>
                    <UserNav />
                </Suspense>
            }
        >
            {children}
        </AppLayout>
    );
}
