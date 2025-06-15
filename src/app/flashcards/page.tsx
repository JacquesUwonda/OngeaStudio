
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Flashcard } from "@/components/flashcard";
import { flashcards as staticFlashcardsData, FlashcardData as StaticFlashcardType } from "@/data/flashcards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcardAction } from "@/lib/actions";
import type { GenerateFlashcardInput, GenerateFlashcardOutput } from "@/ai/flows/generate-flashcard-flow";

// Represents the structure of the card currently being displayed
interface DisplayedFlashcard {
  id: string;
  learningTerm: string;
  spokenTerm: string;
  category?: string;
  learningLangTTS: string;
  spokenLangTTS: string;
}

export default function FlashcardsPage() {
  const { learningLanguage, spokenLanguage, getLanguageLabel, getLanguageTtsCode } = useLanguage();
  const { toast } = useToast();

  const [shuffledStaticCards, setShuffledStaticCards] = useState<StaticFlashcardType[]>([]);
  const [currentStaticIndex, setCurrentStaticIndex] = useState(0);
  const [currentDisplayedCard, setCurrentDisplayedCard] = useState<DisplayedFlashcard | null>(null);
  
  const [knownCardIds, setKnownCardIds] = useState<string[]>([]); // Tracks IDs of known static cards
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const [generateTopic, setGenerateTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const mapStaticToDisplayed = useCallback((staticCard: StaticFlashcardType): DisplayedFlashcard => {
    // Static cards are French/English. This mapping makes them displayable.
    // Their relevance depends on current language selection.
    return {
      id: staticCard.id,
      learningTerm: staticCard.french, // Assuming static cards' "french" field is the term to learn
      spokenTerm: staticCard.english,   // Assuming static cards' "english" field is the translation
      category: staticCard.category,
      learningLangTTS: 'fr-FR', // Static cards are Fr
      spokenLangTTS: 'en-US',   // Static cards are En
    };
  }, []);

  const initializeOrResetSession = useCallback(() => {
    const shuffled = [...staticFlashcardsData].sort(() => Math.random() - 0.5);
    setShuffledStaticCards(shuffled);
    setCurrentStaticIndex(0);
    setKnownCardIds([]);
    setSessionCompleted(false);
    if (shuffled.length > 0) {
      setCurrentDisplayedCard(mapStaticToDisplayed(shuffled[0]));
    } else {
      setCurrentDisplayedCard(null);
    }
  }, [mapStaticToDisplayed]);

  useEffect(() => {
    initializeOrResetSession();
  }, [initializeOrResetSession]);

  const handleKnow = () => {
    if (currentDisplayedCard && staticFlashcardsData.some(sc => sc.id === currentDisplayedCard.id)) {
      // Only add to knownCardIds if it's one of the original static cards
      setKnownCardIds(prev => [...new Set([...prev, currentDisplayedCard.id])]);
    }
    goToNextCard();
  };

  const handleDontKnow = () => {
    goToNextCard();
  };

  const goToNextCard = () => {
    if (currentStaticIndex < shuffledStaticCards.length - 1) {
      const nextIdx = currentStaticIndex + 1;
      setCurrentStaticIndex(nextIdx);
      setCurrentDisplayedCard(mapStaticToDisplayed(shuffledStaticCards[nextIdx]));
    } else {
      // Reached end of static cards
      if (shuffledStaticCards.length > 0) {
         setSessionCompleted(true); // Only complete session if there were static cards
      } else if (!currentDisplayedCard) {
        // No static cards and no generated card displayed, maybe show a message or allow generation
      }
    }
  };

  const goToPreviousCard = () => {
    if (currentStaticIndex > 0) {
      const prevIdx = currentStaticIndex - 1;
      setCurrentStaticIndex(prevIdx);
      setCurrentDisplayedCard(mapStaticToDisplayed(shuffledStaticCards[prevIdx]));
      setSessionCompleted(false); // If going back, session is no longer "completed"
    }
  };
  
  const restartSession = () => {
    initializeOrResetSession();
  };

  const handleGenerateFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateTopic.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const input: GenerateFlashcardInput = {
        learningLanguage: getLanguageLabel(learningLanguage),
        spokenLanguage: getLanguageLabel(spokenLanguage),
        topicOrWord: generateTopic,
      };
      const result = await generateFlashcardAction(input);
      const newCard: DisplayedFlashcard = {
        id: `generated-${Date.now()}`,
        learningTerm: result.learningTerm,
        spokenTerm: result.spokenTerm,
        category: result.category,
        learningLangTTS: getLanguageTtsCode(learningLanguage),
        spokenLangTTS: getLanguageTtsCode(spokenLanguage),
      };
      setCurrentDisplayedCard(newCard);
      setGenerateTopic(""); 
      setSessionCompleted(false); // A new card is shown, so session isn't "completed" in the same way
      toast({ title: "Flashcard Generated!", description: `New card for "${result.learningTerm}" created.` });
    } catch (error) {
      toast({
        title: "Error Generating Flashcard",
        description: (error as Error).message || "Could not generate flashcard.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const totalStaticCards = shuffledStaticCards.length;
  const progress = totalStaticCards > 0 ? (currentStaticIndex / totalStaticCards) * 100 : 0;
  const knownPercentage = totalStaticCards > 0 ? (knownCardIds.length / totalStaticCards) * 100 : 0;

  if (sessionCompleted && totalStaticCards > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-8">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Static Set Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-2">You reviewed all {totalStaticCards} static flashcards.</p>
            <p className="text-xl font-semibold mb-4">
              You knew <span className="text-accent">{knownCardIds.length}</span> ({Math.round(knownPercentage)}%) of them.
            </p>
            <Button onClick={restartSession} size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Practice Static Set Again
            </Button>
          </CardContent>
        </Card>
        <FlashcardGenerationModule 
          generateTopic={generateTopic}
          setGenerateTopic={setGenerateTopic}
          handleGenerateFlashcard={handleGenerateFlashcard}
          isGenerating={isGenerating}
          learningLanguageLabel={getLanguageLabel(learningLanguage)}
          spokenLanguageLabel={getLanguageLabel(spokenLanguage)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] p-4 space-y-8">
      <FlashcardGenerationModule 
        generateTopic={generateTopic}
        setGenerateTopic={setGenerateTopic}
        handleGenerateFlashcard={handleGenerateFlashcard}
        isGenerating={isGenerating}
        learningLanguageLabel={getLanguageLabel(learningLanguage)}
        spokenLanguageLabel={getLanguageLabel(spokenLanguage)}
      />

      {currentDisplayedCard ? (
        <>
          {totalStaticCards > 0 && (
            <div className="w-full max-w-md">
              <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                <span>Card {currentStaticIndex + 1} of {totalStaticCards} (Static Set)</span>
                <span>Known: {knownCardIds.length} ({Math.round(knownPercentage)}%)</span>
              </div>
              <Progress value={progress} className="w-full h-2 mb-2" />
            </div>
          )}

          <Flashcard
            learningTerm={currentDisplayedCard.learningTerm}
            spokenTerm={currentDisplayedCard.spokenTerm}
            learningLangTTS={currentDisplayedCard.learningLangTTS}
            spokenLangTTS={currentDisplayedCard.spokenLangTTS}
            onKnow={handleKnow}
            onDontKnow={handleDontKnow}
          />

          <div className="mt-2 flex flex-wrap justify-center gap-2 w-full max-w-md">
            <Button 
              variant="outline" 
              onClick={goToPreviousCard} 
              disabled={currentStaticIndex === 0 || totalStaticCards === 0} 
              className="px-6 py-3"
            >
              <ChevronLeft className="mr-2 h-5 w-5" /> Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={goToNextCard} 
              disabled={(currentStaticIndex >= totalStaticCards -1 && totalStaticCards > 0) || totalStaticCards === 0} 
              className="px-6 py-3"
            >
              Next <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          {totalStaticCards > 0 && (
            <Button variant="ghost" onClick={restartSession} className="mt-2 text-sm text-muted-foreground">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Static Set
            </Button>
          )}
        </>
      ) : (
         <div className="text-center text-muted-foreground p-8">
            <p className="mb-4">No flashcards to display. Try generating one!</p>
            {totalStaticCards === 0 && <p className="text-sm">(There are no pre-loaded static cards for this session.)</p>}
        </div>
      )}
    </div>
  );
}


interface FlashcardGenerationModuleProps {
  generateTopic: string;
  setGenerateTopic: (value: string) => void;
  handleGenerateFlashcard: (e: React.FormEvent) => Promise<void>;
  isGenerating: boolean;
  learningLanguageLabel: string;
  spokenLanguageLabel: string;
}

function FlashcardGenerationModule({
  generateTopic,
  setGenerateTopic,
  handleGenerateFlashcard,
  isGenerating,
  learningLanguageLabel,
  spokenLanguageLabel
}: FlashcardGenerationModuleProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          Generate New Flashcard
        </CardTitle>
        <CardDescription>
          Enter a topic or word (in {spokenLanguageLabel} or {learningLanguageLabel}) to generate a new flashcard for your {learningLanguageLabel} learning.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleGenerateFlashcard}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topicOrWord">Topic or Word</Label>
            <Input
              id="topicOrWord"
              value={generateTopic}
              onChange={(e) => setGenerateTopic(e.target.value)}
              placeholder={`e.g., "animals", "hello", "apple"`}
              disabled={isGenerating}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isGenerating || !generateTopic.trim()} className="w-full">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Card
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
