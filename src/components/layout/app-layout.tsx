"use client";

import React from "react";
import Link from "next/link";
import { BookHeart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "./sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader className="p-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <BookHeart className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-headline font-semibold">Ongea</h1>
            </Link>
            <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full hidden">
               <Link href="/" className="flex items-center gap-2">
                <BookHeart className="h-7 w-7 text-primary" />
               </Link>
            </div>
        </SidebarHeader>
        <SidebarContent className="flex-grow">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-muted-foreground">© 2024 Ongea</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden mr-2"/>
            {/* Placeholder for breadcrumbs or page title if needed */}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* User avatar/menu could go here */}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
