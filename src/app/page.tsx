import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Layers, MessageCircle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const features = [
    {
      title: "Interactive Stories",
      description: "Read beginner-friendly stories in French and click to see translations.",
      icon: BookOpen,
      href: "/stories",
      cta: "Explore Stories",
    },
    {
      title: "Digital Flashcards",
      description: "Memorize new vocabulary with interactive flashcards.",
      icon: Layers,
      href: "/flashcards",
      cta: "Practice Flashcards",
    },
    {
      title: "AI Language Partner",
      description: "Chat with an AI to practice French and get grammar tips.",
      icon: MessageCircle,
      href: "/chat",
      cta: "Start Chatting",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">
          Welcome to Ongea!
        </h1>
        <p className="text-xl text-muted-foreground">
          Your personal companion for learning French.
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

      <section className="mt-16 p-8 bg-card rounded-lg shadow-md">
        <h2 className="text-3xl font-headline font-semibold text-center mb-6">Why Ongea?</h2>
        <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">Engaging Learning</h3>
            <p className="text-muted-foreground">
              Interactive content keeps you motivated and makes learning fun. Our AI tools adapt to your pace.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">Practical Skills</h3>
            <p className="text-muted-foreground">
              Focus on real-world French used in everyday conversations and stories. Build a strong foundation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
