
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
  topic: z.string().describe('The topic of the story to generate.'),
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
  prompt: `You are a helpful assistant skilled at creating beginner-friendly stories.
  The user wants a story in {{{learningLanguage}}}. Their primary language is {{{spokenLanguage}}}.

  Please generate a story based on the following topic: {{{topic}}}.
  The story should be approximately {{length}} in length.

  The story should be suitable for beginner learners of {{{learningLanguage}}}, using simple vocabulary and grammar.
  Please provide the story and its title in {{{learningLanguage}}}.
  Ensure the output is valid JSON.

  Here are the valid values for length:
  - short: approximately 50-100 words
  - medium: approximately 150-250 words
  - long: approximately 300-400 words
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
