
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Utensils, Plane, ShoppingCart, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const scenarios = [
  {
    name: 'At the Restaurant',
    description: 'Practice ordering food and drinks.',
    icon: Utensils,
    href: '/scenarios/restaurant',
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
  },
  {
    name: 'At the Airport',
    description: 'Navigate check-in, security, and boarding.',
    icon: Plane,
    href: '/scenarios/airport',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
  {
    name: 'Shopping',
    description: 'Ask for sizes, prices, and make purchases.',
    icon: ShoppingCart,
    href: '/scenarios/shopping',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'At the Hotel',
    description: 'Handle check-in, check-out, and ask for services.',
    icon: Building,
    href: '/scenarios/hotel',
    color: 'text-gray-600',
    bgColor: 'bg-gray-600/10',
  },
];

export default function SelectScenarioPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <Badge variant="outline" className="mb-4 text-sm font-medium border-primary/50 text-primary">
          New Feature
        </Badge>
        <h1 className="text-4xl font-bold font-headline text-primary">AI Role-Playing Scenarios</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose a real-world situation to practice your conversation skills.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {scenarios.map((scenario) => (
          <Link href={scenario.href} key={scenario.name} passHref>
            <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary">
              <CardHeader className="flex-grow p-6">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${scenario.bgColor}`}>
                    <scenario.icon className={`h-8 w-8 ${scenario.color}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div className="mt-4">
                  <CardTitle className="font-headline text-xl">{scenario.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{scenario.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
