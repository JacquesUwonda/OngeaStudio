'use server';

/**
 * @fileOverview Flow for generating beginner-friendly stories in French with English translations available on click.
 *
 * - generateFrenchStory - A function that handles the story generation process.
 * - GenerateFrenchStoryInput - The input type for the generateFrenchStory function.
 * - GenerateFrenchStoryOutput - The return type for the generateFrenchStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFrenchStoryInputSchema = z.object({
  topic: z.string().describe('The topic of the story to generate.'),
  length: z
    .enum(['short', 'medium', 'long'])
    .describe('The desired length of the story.'),
});
export type GenerateFrenchStoryInput = z.infer<typeof GenerateFrenchStoryInputSchema>;

const GenerateFrenchStoryOutputSchema = z.object({
  title: z.string().describe('The title of the generated story in French.'),
  story: z.string().describe('The generated story in French.'),
});
export type GenerateFrenchStoryOutput = z.infer<typeof GenerateFrenchStoryOutputSchema>;

export async function generateFrenchStory(input: GenerateFrenchStoryInput): Promise<GenerateFrenchStoryOutput> {
  return generateFrenchStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFrenchStoryPrompt',
  input: {schema: GenerateFrenchStoryInputSchema},
  output: {schema: GenerateFrenchStoryOutputSchema},
  prompt: `You are a helpful assistant skilled at creating beginner-friendly stories in French.

  Please generate a story based on the following topic: {{{topic}}}.
  The story should be approximately {{length}} in length.

  The story should be suitable for beginner French learners, using simple vocabulary and grammar.
  Please provide the story in French, along with a title in French.
  Ensure the output is valid JSON.

  Here are the valid values for length:
  - short: approximately 50-100 words
  - medium: approximately 150-250 words
  - long: approximately 300-400 words
  `,
});

const generateFrenchStoryFlow = ai.defineFlow(
  {
    name: 'generateFrenchStoryFlow',
    inputSchema: GenerateFrenchStoryInputSchema,
    outputSchema: GenerateFrenchStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
