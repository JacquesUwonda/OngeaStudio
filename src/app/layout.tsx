
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/layout/app-layout";
import { LanguageProvider } from "@/contexts/language-context";

export const metadata: Metadata = {
  title: "Ongea - French Learning Companion",
  description: "Learn French with interactive stories, flashcards, and an AI language partner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..0,900;1,200..1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
