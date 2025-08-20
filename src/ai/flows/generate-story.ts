
'use server';

/**
 * @fileOverview Flow for generating beginner-friendly stories in a specified language.
 *
 * - generateStory - A function that handles the story generation process.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  domain: z.string().describe("The broad category of the story (e.g., 'Technology', 'History')."),
  topic: z.string().describe('The specific topic of the story to generate.'),
  customTopic: z.string().optional().describe('A user-provided topic to override the selected one.'),
  level: z.enum(['beginner', 'intermediate', 'advanced']).describe('The difficulty level of the story.'),
  tone: z.enum(['informative', 'conversational', 'formal', 'creative', 'technical']).describe('The tone of the story.'),
  length: z
    .enum(['short', 'medium', 'long'])
    .describe('The desired length of the story.'),
  learningLanguage: z.string().describe('The language the story should be written in (e.g., "French", "Spanish").'),
  spokenLanguage: z.string().describe('The user primary language for context (e.g., "English").'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  title: z.string().describe('The title of the generated story in the learning language.'),
  story: z.string().describe('The generated story in the learning language.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: {schema: GenerateStoryInputSchema},
  output: {schema: GenerateStoryOutputSchema},
  prompt: `You are a helpful assistant skilled at creating stories for language learners.
  The user's primary language is {{{spokenLanguage}}}, and they are learning {{{learningLanguage}}}.

  Your task is to generate a story in {{{learningLanguage}}}.

  Here are the user's preferences:
  - Domain: {{{domain}}}
  - Topic: {{#if customTopic}}{{{customTopic}}}{{else}}{{{topic}}}{{/if}}
  - Desired Length: {{{length}}} (short: ~50-100 words, medium: ~150-250 words, long: ~300-400 words)
  - Difficulty Level: {{{level}}}
  - Tone: {{{tone}}}

  Please adhere to these rules:
  1.  The story's content and title must be entirely in {{{learningLanguage}}}.
  2.  The vocabulary and grammar must match the requested difficulty level ({{{level}}}). For 'beginner', use very simple sentence structures and common words. For 'advanced', you can use more complex grammar and richer vocabulary.
  3.  The story must be relevant to the topic "{{#if customTopic}}{{{customTopic}}}{{else}}{{{topic}}}{{/if}}" within the "{{{domain}}}" domain.
  4.  The writing style must reflect the chosen tone ({{{tone}}}).
  5.  The total word count should be appropriate for the chosen length ({{{length}}}).
  6.  Ensure the output is a valid JSON object with a "title" and a "story" field.
  `,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
