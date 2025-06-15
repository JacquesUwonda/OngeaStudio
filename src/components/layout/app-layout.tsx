
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookHeart, Languages, MessageSquareText } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const availableLanguages = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "sw", label: "Swahili" },
  { value: "lin", label: "Lingala" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Mandarin Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [spokenLanguage, setSpokenLanguage] = useState("en");
  const [learningLanguage, setLearningLanguage] = useState("fr");

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
        <SidebarFooter className="p-4 space-y-4">
          <div className="space-y-2 group-data-[collapsible=icon]:hidden">
            <Label htmlFor="spoken-language-select" className="text-xs text-muted-foreground flex items-center">
              <MessageSquareText className="h-4 w-4 mr-1.5" /> Your Language
            </Label>
            <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
              <SelectTrigger id="spoken-language-select" className="h-9 text-xs">
                <SelectValue placeholder="Select your language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map(lang => (
                  <SelectItem key={`spoken-${lang.value}`} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 group-data-[collapsible=icon]:hidden">
            <Label htmlFor="learning-language-select" className="text-xs text-muted-foreground flex items-center">
              <Languages className="h-4 w-4 mr-1.5" /> Learning Language
            </Label>
            <Select value={learningLanguage} onValueChange={setLearningLanguage}>
              <SelectTrigger id="learning-language-select" className="h-9 text-xs">
                <SelectValue placeholder="Select language to learn" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map(lang => (
                  <SelectItem key={`learning-${lang.value}`} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            © 2025 Ongea by Jacques Uwonda
          </p>
           <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full hidden mt-2">
             <Languages className="h-5 w-5 text-muted-foreground" />
           </div>
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
