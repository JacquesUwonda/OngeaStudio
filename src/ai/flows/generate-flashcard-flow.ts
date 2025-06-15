
'use server';
/**
 * @fileOverview Flow for generating a set of flashcards for language learning.
 *
 * - generateFlashcards - A function that handles the flashcard set generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  learningLanguage: z.string().describe('The language the user is learning (e.g., "French", "Spanish").'),
  spokenLanguage: z.string().describe('The user primary language (e.g., "English").'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardItemSchema = z.object({
  learningTerm: z.string().describe('The word or phrase in the learning language.'),
  spokenTerm: z.string().describe('The translation of the term in the spoken language.'),
  category: z.string().optional().describe('A suggested category for the flashcard (e.g., "Food", "Travel", "Verbs").'),
});

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardItemSchema).length(20).describe('An array of 20 flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an assistant that creates sets of flashcards for language learners.
The user's spoken language is {{{spokenLanguage}}} and they are learning {{{learningLanguage}}}.

Generate a list of 20 common, beginner-level words or short phrases in {{{learningLanguage}}}.
For each word/phrase, provide its direct translation in {{{spokenLanguage}}}.
Optionally, suggest a concise category for each flashcard (e.g., "Food", "Numbers", "Common Verbs", "Adjectives").

Return ONLY a JSON object with a "flashcards" key, where the value is an array of 20 flashcard objects.
Each flashcard object must have "learningTerm", "spokenTerm", and optionally "category".

Example structure for the output:
{
  "flashcards": [
    { "learningTerm": "le chat", "spokenTerm": "the cat", "category": "Animals" },
    { "learningTerm": "manger", "spokenTerm": "to eat", "category": "Verbs" },
    // ... 18 more flashcards
  ]
}
`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.flashcards || output.flashcards.length !== 20) {
      throw new Error("AI failed to generate a valid set of 20 flashcards.");
    }
    return output;
  }
);

