
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Utensils, Plane, MessageSquare, Building, HeartPulse, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const topics = [
  {
    name: 'Common Phrases',
    description: 'Essential greetings and basic conversation.',
    icon: MessageSquare,
    href: '/flashcards/common-phrases',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'Travel',
    description: 'Words for navigation, accommodation, and transport.',
    icon: Plane,
    href: '/flashcards/travel',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
  {
    name: 'Food & Dining',
    description: 'Vocabulary for restaurants, ingredients, and ordering.',
    icon: Utensils,
    href: '/flashcards/food-dining',
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
  },
  {
    name: 'Shopping',
    description: 'Learn terms for clothing, stores, and payments.',
    icon: Building,
    href: '/flashcards/shopping',
    color: 'text-gray-600',
    bgColor: 'bg-gray-600/10',
  },
  {
    name: 'Health',
    description: 'Topics on fitness, doctor visits, and well-being.',
    icon: HeartPulse,
    href: '/flashcards/health',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
    {
    name: 'Colors & Shapes',
    description: 'Basic descriptive words for objects.',
    icon: Palette,
    href: '/flashcards/colors-shapes',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export default function SelectFlashcardTopicPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <Badge variant="outline" className="mb-4 text-sm font-medium border-primary/50 text-primary">
          Step 1 of 2
        </Badge>
        <h1 className="text-4xl font-bold font-headline text-primary">Choose a Flashcard Topic</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a category to generate a set of 20 relevant flashcards.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link href={topic.href} key={topic.name} passHref>
            <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary">
              <CardHeader className="flex-grow p-6">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${topic.bgColor}`}>
                    <topic.icon className={`h-8 w-8 ${topic.color}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div className="mt-4">
                  <CardTitle className="font-headline text-xl">{topic.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{topic.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
