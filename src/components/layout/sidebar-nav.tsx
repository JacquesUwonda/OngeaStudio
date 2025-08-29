
"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { BarChart3, BookOpen, Home, Layers, LogOut, MessageCircle, Theater } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/scenarios", label: "Scenarios", icon: Theater },
  { href: "/chat", label: "Chat AI", icon: MessageCircle },
  { href: "/admin", label: "Analytics", icon: BarChart3 },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { signOut } = useAuth();

  return (
    <SidebarMenu className="flex flex-col justify-between flex-1">
      <div>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} asChild>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard")}
                tooltip={{ children: item.label, side: "right", align: "center" }}
                onClick={() => setOpenMobile(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </div>
      <div>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => signOut()}
            tooltip={{ children: "Sign Out", side: "right", align: "center" }}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
}
