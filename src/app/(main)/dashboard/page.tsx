import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Layers, MessageCircle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const features = [
    {
      title: "Interactive Stories",
      description: "Read beginner-friendly stories in your target language and click to see translations.",
      icon: BookOpen,
      href: "/stories",
      cta: "Explore Stories",
    },
    {
      title: "AI Flashcards",
      description: "Generate and memorize new vocabulary with interactive flashcards.",
      icon: Layers,
      href: "/flashcards",
      cta: "Practice Flashcards",
    },
    {
      title: "AI Language Partner",
      description: "Chat with an AI to practice conversations and get grammar tips.",
      icon: MessageCircle,
      href: "/chat",
      cta: "Start Chatting",
    },
  ];

  return (
    <div className="py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">
          Welcome to Ongea!
        </h1>
        <p className="text-xl text-muted-foreground">
          Your personal companion for language learning. Select an activity to get started.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start gap-4 pb-4">
              <feature.icon className="h-10 w-10 text-accent mt-1" />
              <div>
                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={feature.href} passHref className="w-full">
                <Button variant="default" className="w-full">
                  {feature.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
