
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookHeart, MessageCircle, Layers3, AudioWaveform, BotMessageSquare, Infinity, Laptop, Languages } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6 h-16 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <BookHeart className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold font-headline">Ongea</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="/signin" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Sign In
          </Link>
          <ThemeToggle />
          <Button asChild>
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Enrich Your Vocabulary with{" "}
                    <span className="text-primary">AI-Powered Learning</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Ongea helps you master any language with personalized stories, AI-generated flashcards, and a conversational partner. No credit card required.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">Start Learning for Free</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint="language learning"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="px-4 md:px-6">
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
                <Card key={feature.title} className="shadow-md hover:shadow-lg transition-shadow">
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
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 Ongea by Jacques Uwonda. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
