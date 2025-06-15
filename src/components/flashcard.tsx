"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  french: string;
  english: string;
  onKnow: () => void;
  onDontKnow: () => void;
}

export function Flashcard({ french, english, onKnow, onDontKnow }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) { // If flipping to show answer
      setShowButtons(true);
    }
  };
  
  const handleNext = (knowIt: boolean) => {
    if (knowIt) onKnow(); else onDontKnow();
    setIsFlipped(false);
    setShowButtons(false);
  }

  const speak = (text: string, lang: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective">
      <Card
        className={cn(
          "relative w-full h-64 rounded-xl shadow-xl transition-transform duration-700 preserve-3d cursor-pointer",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={!showButtons ? handleFlip : undefined} // Only flip if buttons aren't shown
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`Flashcard: ${isFlipped ? 'English side' : 'French side'}. Click to flip.`}
      >
        {/* Front of the card (French) */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 bg-card rounded-xl">
          <CardContent className="text-center">
            <h2 className="text-4xl font-semibold font-headline text-primary mb-4">{french}</h2>
            <p className="text-muted-foreground">Click to see translation</p>
          </CardContent>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={(e) => { e.stopPropagation(); speak(french, 'fr-FR'); }}
            aria-label="Speak French word"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Back of the card (English) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-card rounded-xl">
          <CardContent className="text-center">
            <h2 className="text-3xl font-semibold font-headline text-accent mb-4">{english}</h2>
            {showButtons && (
              <div className="mt-6 space-x-4">
                <Button variant="outline" onClick={(e) => {e.stopPropagation(); handleNext(false);}} className="bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground">
                  Don't Know
                </Button>
                <Button variant="default" onClick={(e) => {e.stopPropagation(); handleNext(true);}} className="bg-primary/80 hover:bg-primary text-primary-foreground">
                  Know It!
                </Button>
              </div>
            )}
          </CardContent>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={(e) => { e.stopPropagation(); speak(english, 'en-US'); }}
            aria-label="Speak English word"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
           <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={(e) => { e.stopPropagation(); handleFlip(); setShowButtons(false);}}
            aria-label="Flip card back to French"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </Card>
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
