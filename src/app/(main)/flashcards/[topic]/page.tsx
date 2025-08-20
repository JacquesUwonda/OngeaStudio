
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Link from 'next/link';
import { Flashcard } from "@/components/flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles, Loader2, Library } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcardsAction } from "@/lib/actions";
import type { GenerateFlashcardsInput } from "@/ai/flows/generate-flashcard-flow";
import type { ProcessedFlashcard } from "@/lib/actions";

interface DisplayedFlashcard extends ProcessedFlashcard {
  id: string;
}

const mapProcessedToDisplayed = (processedCard: ProcessedFlashcard, index: number): DisplayedFlashcard => {
    return {
      ...processedCard,
      id: `generated-${Date.now()}-${index}`,
    };
  };

export default function FlashcardsPage() {
  const { learningLanguage, spokenLanguage, getLanguageLabel } = useLanguage();
  const { toast } = useToast();
  const params = useParams();
  const topic = (params.topic as string).replace(/-/g, ' ');

  const [currentFlashcards, setCurrentFlashcards] = useState<DisplayedFlashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentDisplayedCard, setCurrentDisplayedCard] = useState<DisplayedFlashcard | null>(null);
  
  const [knownCardIds, setKnownCardIds] = useState<string[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  
  const fetchAndSetNewFlashcards = useCallback(async () => {
    setIsGenerating(true);
    setSessionCompleted(false);
    setCurrentFlashcards([]);
    setCurrentDisplayedCard(null);
    setKnownCardIds([]);
    setCurrentCardIndex(0);

    try {
      const input: GenerateFlashcardsInput = {
        learningLanguage: getLanguageLabel(learningLanguage),
        spokenLanguage: getLanguageLabel(spokenLanguage),
        topic: topic,
      };
      const results = await generateFlashcardsAction(input);
      if (results && results.length > 0) {
        const newDisplayedCards = results.map(mapProcessedToDisplayed);
        setCurrentFlashcards(newDisplayedCards);
        setCurrentDisplayedCard(newDisplayedCards[0]);
        toast({ title: "New Flashcard Set Generated!", description: `20 new cards for your ${getLanguageLabel(learningLanguage)} learning on ${topic}.` });
      } else {
        toast({ title: "No Flashcards Generated", description: "The AI couldn't generate cards. Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Error Generating Flashcards",
        description: (error as Error).message || "Could not generate flashcard set.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [learningLanguage, spokenLanguage, getLanguageLabel, toast, topic]);

  useEffect(() => {
    fetchAndSetNewFlashcards();
  }, [fetchAndSetNewFlashcards]);

  if (!topic) {
    notFound();
  }

  const handleKnow = () => {
    if (currentDisplayedCard) {
      setKnownCardIds(prev => [...new Set([...prev, currentDisplayedCard.id])]);
    }
    goToNextCard();
  };

  const handleDontKnow = () => {
    goToNextCard();
  };

  const goToNextCard = () => {
    if (currentCardIndex < currentFlashcards.length - 1) {
      const nextIdx = currentCardIndex + 1;
      setCurrentCardIndex(nextIdx);
      setCurrentDisplayedCard(currentFlashcards[nextIdx]);
    } else if (currentFlashcards.length > 0) {
      setSessionCompleted(true);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      const prevIdx = currentCardIndex - 1;
      setCurrentCardIndex(prevIdx);
      setCurrentDisplayedCard(currentFlashcards[prevIdx]);
      setSessionCompleted(false);
    }
  };
  
  const totalCards = currentFlashcards.length;
  const progress = totalCards > 0 ? ((currentCardIndex +1) / totalCards) * 100 : 0;
  const knownPercentage = totalCards > 0 ? (knownCardIds.length / totalCards) * 100 : 0;

  if (isGenerating && currentFlashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6 space-y-8">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary flex items-center justify-center">
              <Loader2 className="mr-3 h-8 w-8 animate-spin" />
              Generating Flashcards...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Please wait while we prepare your new set of flashcards for the topic: <span className="font-semibold capitalize">{topic}</span>.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (sessionCompleted && totalCards > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6 space-y-8">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Set Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-2">You reviewed all {totalCards} flashcards for <span className="font-semibold capitalize">{topic}</span>.</p>
            <p className="text-xl font-semibold mb-4">
              You knew <span className="text-accent">{knownCardIds.length}</span> ({Math.round(knownPercentage)}%) of them.
            </p>
            <div className="flex flex-col gap-4 mt-6">
                <Button onClick={fetchAndSetNewFlashcards} size="lg" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RotateCcw className="mr-2 h-5 w-5" />}
                  Generate New Set
                </Button>
                 <Button variant="outline" asChild>
                    <Link href="/flashcards">
                        <Library className="mr-2 h-4 w-4" />
                        Choose a Different Topic
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="mb-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold font-headline capitalize text-primary">
          Flashcards: {topic}
        </h1>
        <p className="text-muted-foreground mt-1">
          A new set of 20 cards is generated each time. Click "Generate New Set" to refresh.
        </p>
      </header>

       <div className="w-full max-w-md mb-6">
          <Button onClick={fetchAndSetNewFlashcards} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 h-4 w-4" />
            )}
            Generate New Set (20 Cards)
          </Button>
        </div>


      {currentDisplayedCard ? (
        <>
          {totalCards > 0 && (
            <div className="w-full max-w-md">
              <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                <span>Card {currentCardIndex + 1} of {totalCards}</span>
                <span>Known: {knownCardIds.length} ({Math.round(knownPercentage)}%)</span>
              </div>
              <Progress value={progress} className="w-full h-2 mb-2" />
            </div>
          )}

          <Flashcard
            learningTerm={currentDisplayedCard.learningTerm}
            spokenTerm={currentDisplayedCard.spokenTerm}
            onKnow={handleKnow}
            onDontKnow={handleDontKnow}
          />

          <div className="mt-4 flex flex-wrap justify-center gap-2 w-full max-w-md">
            <Button 
              variant="outline" 
              onClick={goToPreviousCard} 
              disabled={currentCardIndex === 0 || totalCards === 0 || isGenerating} 
              className="px-6 py-3"
            >
              <ChevronLeft className="mr-2 h-5 w-5" /> Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={goToNextCard} 
              disabled={(currentCardIndex >= totalCards -1 && totalCards > 0) || totalCards === 0 || isGenerating} 
              className="px-6 py-3"
            >
              Next <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
            <div className="mt-8 text-center">
                <Button variant="ghost" asChild>
                    <Link href="/flashcards">
                        <Library className="mr-2 h-4 w-4" />
                        Back to Topics
                    </Link>
                </Button>
            </div>
        </>
      ) : (
         !isGenerating && (
            <div className="text-center text-muted-foreground p-8">
                <p className="mb-4">No flashcards to display. Click the button above to generate a new set.</p>
            </div>
         )
      )}
    </div>
  );
}

