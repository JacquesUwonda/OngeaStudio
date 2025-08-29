
import AppLayout from "@/components/layout/app-layout";
import { usePathname } from "next/navigation";

export default function MainAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppLayout>{children}</AppLayout>;
}
