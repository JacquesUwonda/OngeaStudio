
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  learningTerm: string;
  spokenTerm: string;
  learningLangTTS: string; // e.g., "fr-FR"
  spokenLangTTS: string;   // e.g., "en-US"
  onKnow: () => void;
  onDontKnow: () => void;
}

export function Flashcard({
  learningTerm,
  spokenTerm,
  learningLangTTS,
  spokenLangTTS,
  onKnow,
  onDontKnow,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) { 
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
      // Cancel any ongoing speech before starting a new one
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  // Reset flip state if terms change (e.g. new card loaded)
  React.useEffect(() => {
    setIsFlipped(false);
    setShowButtons(false);
  }, [learningTerm, spokenTerm]);

  return (
    <div className="w-full max-w-md mx-auto perspective">
      <Card
        className={cn(
          "relative w-full h-64 rounded-xl shadow-xl transition-transform duration-700 preserve-3d cursor-pointer",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={!showButtons ? handleFlip : undefined} 
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`Flashcard: ${isFlipped ? 'Spoken language side' : 'Learning language side'}. Click to flip.`}
      >
        {/* Front of the card (Learning Language) */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 bg-card rounded-xl">
          <CardContent className="text-center">
            <h2 className="text-4xl font-semibold font-headline text-primary mb-4">{learningTerm}</h2>
            <p className="text-muted-foreground">Click to see translation</p>
          </CardContent>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={(e) => { e.stopPropagation(); speak(learningTerm, learningLangTTS); }}
            aria-label={`Speak term in learning language: ${learningTerm}`}
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Back of the card (Spoken Language) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-card rounded-xl">
          <CardContent className="text-center">
            <h2 className="text-3xl font-semibold font-headline text-accent mb-4">{spokenTerm}</h2>
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
            onClick={(e) => { e.stopPropagation(); speak(spokenTerm, spokenLangTTS); }}
            aria-label={`Speak term in spoken language: ${spokenTerm}`}
          >
            <Volume2 className="h-5 w-5" />
          </Button>
           <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={(e) => { e.stopPropagation(); handleFlip(); setShowButtons(false);}}
            aria-label="Flip card back to learning language"
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

