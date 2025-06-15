"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Flashcard } from "@/components/flashcard";
import { flashcards as allFlashcards, FlashcardData } from "@/data/flashcards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<FlashcardData[]>([]);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const shuffleAndSetFlashcards = useCallback(() => {
    const shuffled = [...allFlashcards].sort(() => Math.random() - 0.5);
    setShuffledFlashcards(shuffled);
    setCurrentIndex(0);
    setKnownCards([]);
    setSessionCompleted(false);
  }, []);

  useEffect(() => {
    shuffleAndSetFlashcards();
  }, [shuffleAndSetFlashcards]);

  const handleKnow = () => {
    setKnownCards(prev => [...prev, shuffledFlashcards[currentIndex].id]);
    goToNextCard();
  };

  const handleDontKnow = () => {
    goToNextCard();
  };

  const goToNextCard = () => {
    if (currentIndex < shuffledFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const goToPreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const restartSession = () => {
    shuffleAndSetFlashcards();
  };

  if (shuffledFlashcards.length === 0) {
    return <div className="flex items-center justify-center h-full">Loading flashcards...</div>;
  }

  const currentCard = shuffledFlashcards[currentIndex];
  const progress = (currentIndex / shuffledFlashcards.length) * 100;
  const knownPercentage = (knownCards.length / shuffledFlashcards.length) * 100;

  if (sessionCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Session Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-2">You reviewed all {shuffledFlashcards.length} flashcards.</p>
            <p className_content="text-xl font-semibold mb-4">
              You knew <span className="text-accent">{knownCards.length}</span> ({Math.round(knownPercentage)}%) of them.
            </p>
            <Button onClick={restartSession} size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Practice Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
          <span>Card {currentIndex + 1} of {shuffledFlashcards.length}</span>
          <span>Known: {knownCards.length} ({Math.round(knownPercentage)}%)</span>
        </div>
        <Progress value={progress} className="w-full h-2" />
      </div>

      <Flashcard
        french={currentCard.french}
        english={currentCard.english}
        onKnow={handleKnow}
        onDontKnow={handleDontKnow}
      />

      <div className="mt-8 flex justify-center space-x-4 w-full max-w-md">
        <Button variant="outline" onClick={goToPreviousCard} disabled={currentIndex === 0} className="px-6 py-3">
          <ChevronLeft className="mr-2 h-5 w-5" /> Previous
        </Button>
        <Button variant="outline" onClick={goToNextCard} disabled={currentIndex === shuffledFlashcards.length -1} className="px-6 py-3">
          Next <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
       <Button variant="ghost" onClick={restartSession} className="mt-4 text-sm text-muted-foreground">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart Session
      </Button>
    </div>
  );
}
