
"use client";

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Cpu, FlaskConical, Landmark, Plane, Briefcase, HeartPulse, Palette, Film, Bot, Rocket, Castle, Pyramid, Globe, Bitcoin, Stethoscope, Microscope, Brush, Clapperboard } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const domainDetails = {
  technology: { 
    name: 'Technology', 
    icon: Cpu,
    color: 'text-blue-500',
    topics: [
      { name: 'Artificial Intelligence', icon: Bot },
      { name: 'Software Development', icon: Cpu },
      { name: 'Space Exploration', icon: Rocket },
    ] 
  },
  science: { 
    name: 'Science', 
    icon: FlaskConical,
    color: 'text-green-500',
    topics: [
      { name: 'Biology', icon: Microscope },
      { name: 'Chemistry', icon: FlaskConical },
      { name: 'Physics', icon: Rocket },
    ]
  },
  history: { 
    name: 'History', 
    icon: Landmark,
    color: 'text-amber-600',
    topics: [
      { name: 'Ancient Civilizations', icon: Pyramid },
      { name: 'Medieval Europe', icon: Castle },
      { name: 'World Wars', icon: Landmark },
    ]
  },
  travel: { 
    name: 'Travel', 
    icon: Plane,
    color: 'text-sky-500',
    topics: [
      { name: 'World Capitals', icon: Globe },
      { name: 'Natural Wonders', icon: Plane },
      { name: 'Cultural Festivals', icon: Castle },
    ]
  },
  business: { 
    name: 'Business', 
    icon: Briefcase,
    color: 'text-gray-600',
    topics: [
      { name: 'Marketing', icon: Briefcase },
      { name: 'Finance', icon: Bitcoin },
      { name: 'Startups', icon: Rocket },
    ]
  },
  health: { 
    name: 'Health', 
    icon: HeartPulse,
    color: 'text-red-500',
    topics: [
      { name: 'Nutrition', icon: HeartPulse },
      { name: 'Fitness', icon: Stethoscope },
      { name: 'Mental Wellness', icon: Bot },
    ]
  },
  art: {
    name: 'Art',
    icon: Palette,
    color: 'text-purple-500',
    topics: [
      { name: 'Renaissance Painting', icon: Brush },
      { name: 'Modern Sculpture', icon: Palette },
      { name: 'Photography', icon: Film },
    ]
  },
  culture: {
    name: 'Culture',
    icon: Film,
    color: 'text-pink-500',
    topics: [
      { name: 'Cinema History', icon: Clapperboard },
      { name: 'World Music', icon: Film },
      { name: 'Global Cuisine', icon: Globe },
    ]
  }
};

type DomainKeys = keyof typeof domainDetails;

export default function SelectTopicPage() {
  const params = useParams();
  const domainKey = params.domain as DomainKeys;
  const domain = domainDetails[domainKey];
  const { getLanguageLabel, learningLanguage } = useLanguage();

  if (!domain) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <Badge variant="outline" className="mb-4 text-sm font-medium border-primary/50 text-primary">
          Step 2 of 3
        </Badge>
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center justify-center gap-3">
          <domain.icon className={`h-10 w-10 ${domain.color}`} />
          Choose a Topic in {domain.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a specific topic to generate a story about for your {getLanguageLabel(learningLanguage)} learning.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {domain.topics.map((topic) => (
          <Link href={`/stories/${domainKey}/${topic.name.toLowerCase().replace(/\s+/g, '-')}`} key={topic.name} passHref>
            <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary">
              <CardHeader className="flex-grow p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <topic.icon className={`h-8 w-8 ${domain.color}`} />
                        <CardTitle className="font-headline text-xl">{topic.name}</CardTitle>
                    </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="outline" asChild>
          <Link href="/stories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Domains
          </Link>
        </Button>
      </div>
    </div>
  );
}
