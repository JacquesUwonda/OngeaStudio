
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookHeart, MessageCircle, Layers3, AudioWaveform, BotMessageSquare, Infinity, Languages, Activity, Sparkles, Twitter, Github, Linkedin, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useAnalytics } from "@/hooks/use-analytics";

export default function LandingPage() {
  const { trackButtonClick } = useAnalytics();

  const features = [
    {
      title: "Personalized Stories",
      description: "Generate stories on any topic to learn vocabulary and grammar in context.",
      icon: BotMessageSquare,
    },
    {
      title: "Instant Translation",
      description: "Click any sentence in a story to see its translation in your native language instantly.",
      icon: Languages,
    },
    {
      title: "AI-Powered Flashcards",
      description: "Automatically generate sets of 20 flashcards to practice and memorize new words efficiently.",
      icon: Layers3,
    },
    {
      title: "Audio Pronunciation",
      description: "Listen to the correct pronunciation for every word and phrase on your flashcards.",
      icon: AudioWaveform,
    },
    {
      title: "AI Chat Practice",
      description: "Have conversations with an AI language partner to improve your fluency and confidence.",
      icon: MessageCircle,
    },
    {
      title: "Multi-Language Support",
      description: "Learn from and into dozens of languages, including French, Spanish, Swahili, and more.",
      icon: Infinity,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6 h-16 flex items-center justify-between">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <BookHeart className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold font-headline">Ongea</span>
        </Link>
        <div className="flex items-center gap-4">
            <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
                <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                    Features
                </Link>
                <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                    How It Works
                </Link>
                <Link href="/signin" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                    Sign In
                </Link>
                <Button asChild onClick={() => trackButtonClick('header_signup')}>
                    <Link href="/signup">Get Started Free</Link>
                </Button>
            </nav>
            <ThemeToggle />
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="grid gap-4 py-6">
                            <Link href="#" className="flex items-center justify-center mb-4" prefetch={false}>
                                <BookHeart className="h-6 w-6 text-primary" />
                                <span className="ml-2 text-lg font-semibold font-headline">Ongea</span>
                            </Link>
                            <Link href="#features" className="text-base font-medium hover:underline underline-offset-4" prefetch={false}>
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-base font-medium hover:underline underline-offset-4" prefetch={false}>
                                How It Works
                            </Link>
                            <hr />
                            <Link href="/signin" className="text-base font-medium hover:underline underline-offset-4" prefetch={false}>
                                Sign In
                            </Link>
                            <Button asChild className="w-full" onClick={() => trackButtonClick('mobile_header_signup')}>
                                <Link href="/signup">Get Started Free</Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Enrich Your Vocabulary with{" "}
                    <span className="text-primary">AI-Powered Learning</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Ongea helps you master any language with personalized stories, AI-generated flashcards, and a conversational partner. No credit card required.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild onClick={() => trackButtonClick('hero_signup')}>
                    <Link href="/signup">Start Learning for Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild onClick={() => trackButtonClick('hero_learn_more')}>
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x600.png"
                width="600"
                height="600"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                data-ai-hint="language learning app"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Learn a Language, Your Way</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ongea provides a personalized and effective approach to enrich your vocabulary and master a new language.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">How It Works</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Learning in 3 Simple Steps</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Get started on your language journey with a process designed to be simple and effective.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
                            <Languages className="h-12 w-12 text-primary"/>
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-2">1. Choose Your Languages</h3>
                        <p className="text-muted-foreground">Select your native tongue and the language you want to master from our extensive list.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
                            <Activity className="h-12 w-12 text-primary"/>
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-2">2. Pick an Activity</h3>
                        <p className="text-muted-foreground">Immerse yourself in AI-generated stories, practice with smart flashcards, or chat with our AI partner.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
                           <Sparkles className="h-12 w-12 text-primary"/>
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-2">3. Start Learning</h3>
                        <p className="text-muted-foreground">Enjoy a personalized and interactive learning experience that adapts to your pace and style.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex items-center justify-center">
                    <div className="max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Ready to Start Your Language Adventure?</h2>
                        <p className="mt-4 text-muted-foreground md:text-xl">
                            Join thousands of learners and unlock your potential. Get started with Ongea for free today.
                        </p>
                        <div className="mt-6">
                            <Button size="lg" asChild onClick={() => trackButtonClick('cta_signup')}>
                                <Link href="/signup">
                                    Start Learning Now
                                    <Sparkles className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="border-t bg-muted/40">
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="flex flex-col gap-4 md:col-span-1">
                    <Link href="#" className="flex items-center gap-2" prefetch={false}>
                        <BookHeart className="h-7 w-7 text-primary" />
                        <span className="text-xl font-bold font-headline">Ongea</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">AI-powered language learning, made simple and accessible for everyone.</p>
                    <div className="flex gap-4">
                        <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
                        <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
                        <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-3">
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold">Product</h3>
                        <Link href="#features" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Features</Link>
                        <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>How It Works</Link>
                        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Dashboard</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold">Company</h3>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>About Us</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Blog</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Contact</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold">Legal</h3>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Terms of Service</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Privacy Policy</Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
                <p>&copy; 2025 Ongea by Jacques Uwonda. All rights reserved. Your journey to fluency starts here.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
