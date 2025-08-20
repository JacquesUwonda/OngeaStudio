
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Cpu, FlaskConical, Landmark, Plane, Briefcase, HeartPulse, Palette, Film } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const domains = [
  {
    name: 'Technology',
    description: 'Explore the world of software, gadgets, and AI.',
    icon: Cpu,
    href: '/stories/technology',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'Science',
    description: 'Dive into biology, chemistry, and space.',
    icon: FlaskConical,
    href: '/stories/science',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    name: 'History',
    description: 'Travel back in time to different eras.',
    icon: Landmark,
    href: '/stories/history',
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
  },
  {
    name: 'Travel',
    description: 'Discover new cultures and famous cities.',
    icon: Plane,
    href: '/stories/travel',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
  {
    name: 'Business',
    description: 'Learn about markets, startups, and economy.',
    icon: Briefcase,
    href: '/stories/business',
    color: 'text-gray-600',
    bgColor: 'bg-gray-600/10',
  },
  {
    name: 'Health',
    description: 'Topics on fitness, nutrition, and medicine.',
    icon: HeartPulse,
    href: '/stories/health',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
    {
    name: 'Art',
    description: 'Explore painting, sculpture, and photography.',
    icon: Palette,
    href: '/stories/art',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    name: 'Culture',
    description: 'Cinema, music, and traditions from around the world.',
    icon: Film,
    href: '/stories/culture',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
];

export default function SelectDomainPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <Badge variant="outline" className="mb-4 text-sm font-medium border-primary/50 text-primary">
          Step 1 of 3
        </Badge>
        <h1 className="text-4xl font-bold font-headline text-primary">Choose a Domain</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a subject area you're interested in to start generating your personalized story.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {domains.map((domain) => (
          <Link href={domain.href} key={domain.name} passHref>
            <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary">
              <CardHeader className="flex-grow p-6">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${domain.bgColor}`}>
                    <domain.icon className={`h-8 w-8 ${domain.color}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div className="mt-4">
                  <CardTitle className="font-headline text-xl">{domain.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{domain.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
