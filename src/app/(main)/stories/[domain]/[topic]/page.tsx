
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateStoryAction, translateSentenceAction, textToSpeechAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookText, Sparkles, Info, ArrowLeft, Wand2, Library, Volume2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/language-context';
import type { GenerateStoryInput } from '@/ai/flows/generate-story';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const storyFormSchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  tone: z.enum(['informative', 'conversational', 'formal', 'creative', 'technical']),
  length: z.enum(['short', 'medium', 'long']),
  customTopic: z.string().optional(),
});

type StoryFormValues = z.infer<typeof storyFormSchema>;

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

export default function GenerateStoryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { learningLanguage, spokenLanguage, getLanguageLabel, getLanguageTtsCode } = useLanguage();
  
  const domain = params.domain as string;
  const topic = (params.topic as string).replace(/-/g, ' ');

  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);


  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      level: 'beginner',
      tone: 'informative',
      length: 'short',
      customTopic: '',
    },
  });

  useEffect(() => {
    if (story) {
      const storySentences = story.story
        .match(/[^.!?]+[.!?]+/g)
        ?.map((s, index) => ({ id: `sentence-${index}`, text: s.trim() })) || [];
      setSentences(storySentences);
    } else {
      setSentences([]);
    }
  }, [story]);
  
  if (!domain || !topic) {
      notFound();
  }

  const onSubmit: SubmitHandler<StoryFormValues> = async (data) => {
    setIsLoading(true);
    setStory(null);
    setAudioSrc(null);
    if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    try {
      const fullInput: GenerateStoryInput = {
        ...data,
        domain,
        topic,
        learningLanguage: getLanguageLabel(learningLanguage),
        spokenLanguage: getLanguageLabel(spokenLanguage),
      };
      const result = await generateStoryAction(fullInput);
      setStory(result);
    } catch (error) {
      toast({
        title: 'Error Generating Story',
        description: (error as Error).message || 'Could not generate story. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSentenceClick = async (sentenceId: string) => {
    setSentences(prev => prev.map(s => s.id === sentenceId ? { ...s, isTranslating: true, translation: undefined } : s));
    
    const sentenceToTranslate = sentences.find(s => s.id === sentenceId);
    if (sentenceToTranslate) {
      try {
        const translation = await translateSentenceAction(sentenceToTranslate.text, getLanguageLabel(learningLanguage), getLanguageLabel(spokenLanguage));
        setSentences(prev => prev.map(s => s.id === sentenceId ? { ...s, translation, isTranslating: false } : s));
      } catch (error) {
        toast({
          title: 'Translation Error',
          description: 'Could not translate the sentence.',
          variant: 'destructive',
        });
        setSentences(prev => prev.map(s => s.id === sentenceId ? { ...s, isTranslating: false, translation: 'Translation failed.' } : s));
      }
    }
  };
  
  const handleReadAloud = async () => {
    if (!story) return;
    setIsReadingAloud(true);

    try {
      const ttsCode = getLanguageTtsCode(learningLanguage);
      const result = await textToSpeechAction({ text: story.story, languageCode: ttsCode });
      setAudioSrc(result.audioDataUri);
    } catch (error) {
       toast({
        title: 'Could not generate audio',
        description: (error as Error).message || 'The text-to-speech service failed.',
        variant: 'destructive',
      });
    } finally {
        setIsReadingAloud(false);
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
  }, [audioSrc]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}
      {!story && (
        <header className="mb-10 text-center">
            <Badge variant="outline" className="mb-4 text-sm font-medium border-primary/50 text-primary">
            Step 3 of 3
            </Badge>
            <h1 className="text-4xl font-bold font-headline text-primary">Customize Your Story</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Fine-tune the details for your story about <span className="font-semibold capitalize text-foreground/80">{topic}</span>.
            </p>
        </header>
      )}

      {!story && !isLoading && (
        <Card className="max-w-3xl mx-auto shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone of Voice</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="informative">Informative</SelectItem>
                            <SelectItem value="conversational">Conversational</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Length</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="customTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Topic (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`e.g., "A dog who wants to become a chef" (Overrides "${topic}")`}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        If you want a different topic, write it here. Otherwise, we'll use the one you selected.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="bg-muted/40 px-8 py-4 flex justify-between items-center">
                 <Button variant="outline" asChild>
                    <Link href={`/stories/${domain}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Topics
                    </Link>
                </Button>
                <Button type="submit" size="lg">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Magic Story
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}

      {isLoading && (
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center p-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <CardTitle className="mt-4 text-2xl font-headline">Generating Your Story...</CardTitle>
            <CardDescription>The AI is crafting a unique story for you. This might take a moment.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Skeleton className="h-8 w-3/4 mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {story && !isLoading && (
        <Card className="max-w-3xl mx-auto shadow-xl animate-in fade-in-50 duration-500">
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle className="font-headline text-3xl text-accent">{story.title}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 pt-2 text-base">
                <Info size={16}/> Click a sentence to see its translation in {getLanguageLabel(spokenLanguage)}.
              </CardDescription>
            </div>
            <Button variant="outline" size="lg" onClick={handleReadAloud} disabled={isReadingAloud}>
              {isReadingAloud ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Volume2 className="mr-2 h-5 w-5" />}
              Read Aloud
            </Button>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none dark:prose-invert font-body leading-relaxed text-lg p-6 pt-0">
            {sentences.map((sentence) => (
              <React.Fragment key={sentence.id}>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span 
                      className="cursor-pointer hover:bg-primary/20 p-1 rounded transition-colors"
                      onClick={() => { if (!sentence.translation && !sentence.isTranslating) handleSentenceClick(sentence.id) }}
                      role="button"
                      tabIndex={0}
                    >
                      {sentence.text}{' '}
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Translation</AlertDialogTitle>
                      <AlertDialogDescription className="text-base pt-2">
                        <strong>{getLanguageLabel(learningLanguage)}:</strong> {sentence.text}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 text-base">
                      {sentence.isTranslating && <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin"/> Translating...</div>}
                      {sentence.translation && <p><strong>{getLanguageLabel(spokenLanguage)}:</strong> {sentence.translation}</p>}
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </React.Fragment>
            ))}
          </CardContent>
           <CardFooter className="bg-muted/40 p-4 flex justify-between">
                <Button variant="outline" asChild>
                    <Link href="/stories">
                        <Library className="mr-2 h-4 w-4" />
                        Back to Domains
                    </Link>
                </Button>
                <Button onClick={() => {
                  setStory(null)
                  setAudioSrc(null)
                  if(audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  }}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Another Story
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
