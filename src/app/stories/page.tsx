
"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateStoryAction, translateSentenceAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookText, Sparkles, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/language-context";
import type { GenerateStoryInput } from "@/ai/flows/generate-story";

const storyFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  length: z.enum(["short", "medium", "long"]),
});

type StoryFormValues = Pick<GenerateStoryInput, "topic" | "length">;

interface GeneratedStory {
  title: string;
  story: string;
}

interface Sentence {
  id: string;
  text: string;
  translation?: string;
  isTranslating?: boolean;
}

export default function StoriesPage() {
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { learningLanguage, spokenLanguage, getLanguageLabel } = useLanguage();

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      topic: "",
      length: "short",
    },
  });

  useEffect(() => {
    if (story) {
      const storySentences = story.story
        .match(/[^.!?]+[.!?]+/g) // Split into sentences
        ?.map((s, index) => ({ id: `sentence-${index}`, text: s.trim() })) || [];
      setSentences(storySentences);
    } else {
      setSentences([]);
    }
  }, [story]);

  const onSubmit: SubmitHandler<StoryFormValues> = async (data) => {
    setIsLoading(true);
    setStory(null);
    try {
      const fullInput: GenerateStoryInput = {
        ...data,
        learningLanguage: getLanguageLabel(learningLanguage), // Pass full language name
        spokenLanguage: getLanguageLabel(spokenLanguage),   // Pass full language name
      };
      const result = await generateStoryAction(fullInput);
      setStory(result);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not generate story.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSentenceClick = async (sentenceId: string) => {
    setSentences(prevSentences =>
      prevSentences.map(s => 
        s.id === sentenceId ? { ...s, isTranslating: true, translation: undefined } : s
      )
    );
    
    const sentenceToTranslate = sentences.find(s => s.id === sentenceId);
    if (sentenceToTranslate) {
      try {
        const translation = await translateSentenceAction(sentenceToTranslate.text, getLanguageLabel(learningLanguage), getLanguageLabel(spokenLanguage));
        setSentences(prevSentences =>
          prevSentences.map(s =>
            s.id === sentenceId ? { ...s, translation, isTranslating: false } : s
          )
        );
      } catch (error) {
        toast({
          title: "Translation Error",
          description: "Could not translate sentence.",
          variant: "destructive",
        });
        setSentences(prevSentences =>
          prevSentences.map(s =>
            s.id === sentenceId ? { ...s, translation: "Translation failed.", isTranslating: false } : s
          )
        );
      }
    }
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center text-primary">
            <BookText className="mr-2 h-7 w-7" />
            Generate Your Story in {getLanguageLabel(learningLanguage)}
          </CardTitle>
          <CardDescription>
            Enter a topic and choose a length to create a beginner-friendly story in {getLanguageLabel(learningLanguage)}.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Story Topic</Label>
              <Input
                id="topic"
                placeholder={`e.g., A cat's adventure, A day at the park (in ${getLanguageLabel(spokenLanguage)} or ${getLanguageLabel(learningLanguage)})`}
                {...form.register("topic")}
                disabled={isLoading}
              />
              {form.formState.errors.topic && (
                <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Story Length</Label>
              <Select
                onValueChange={(value) => form.setValue("length", value as "short" | "medium" | "long")}
                defaultValue="short"
                disabled={isLoading}
              >
                <SelectTrigger id="length">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (~50-100 words)</SelectItem>
                  <SelectItem value="medium">Medium (~150-250 words)</SelectItem>
                  <SelectItem value="long">Long (~300-400 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Story
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && !story && (
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      )}

      {story && !isLoading && (
        <Card className="shadow-xl animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-accent">{story.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 pt-1">
              <Info size={14}/> Click on a sentence to see its translation in {getLanguageLabel(spokenLanguage)}.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none dark:prose-invert font-body leading-relaxed">
            {sentences.map((sentence) => (
              <React.Fragment key={sentence.id}>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span 
                      className="cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 p-1 rounded transition-colors"
                      onClick={() => {if (!sentence.translation && !sentence.isTranslating) handleSentenceClick(sentence.id)}}
                      role="button"
                      tabIndex={0}
                      aria-label={`Sentence in ${getLanguageLabel(learningLanguage)}: ${sentence.text}. Click to translate to ${getLanguageLabel(spokenLanguage)}.`}
                    >
                      {sentence.text}{' '}
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Translation</AlertDialogTitle>
                      <AlertDialogDescription className="font-code text-base">
                        <strong>{getLanguageLabel(learningLanguage)}:</strong> {sentence.text}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      {sentence.isTranslating && <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin"/> Translating to {getLanguageLabel(spokenLanguage)}...</div>}
                      {sentence.translation && <p><strong>{getLanguageLabel(spokenLanguage)}:</strong> {sentence.translation}</p>}
                    </div>
                    <AlertDialogFooter>
                       {!sentence.translation && !sentence.isTranslating && (
                         <Button onClick={() => handleSentenceClick(sentence.id)}>Translate to {getLanguageLabel(spokenLanguage)}</Button>
                       )}
                      <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
