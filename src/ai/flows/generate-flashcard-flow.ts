
'use server';
/**
 * @fileOverview Flow for generating a single flashcard for language learning.
 *
 * - generateFlashcard - A function that handles the flashcard generation process.
 * - GenerateFlashcardInput - The input type for the generateFlashcard function.
 * - GenerateFlashcardOutput - The return type for the generateFlashcard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardInputSchema = z.object({
  learningLanguage: z.string().describe('The language the user is learning (e.g., "French", "Spanish").'),
  spokenLanguage: z.string().describe('The user primary language (e.g., "English").'),
  topicOrWord: z.string().describe('A topic (e.g., "colors", "food") or a specific word/phrase to generate a flashcard for.'),
});
export type GenerateFlashcardInput = z.infer<typeof GenerateFlashcardInputSchema>;

const GenerateFlashcardOutputSchema = z.object({
  learningTerm: z.string().describe('The word or phrase in the learning language.'),
  spokenTerm: z.string().describe('The translation of the term in the spoken language.'),
  category: z.string().optional().describe('A suggested category for the flashcard (e.g., "Food", "Travel", "Verbs").'),
});
export type GenerateFlashcardOutput = z.infer<typeof GenerateFlashcardOutputSchema>;

export async function generateFlashcard(input: GenerateFlashcardInput): Promise<GenerateFlashcardOutput> {
  return generateFlashcardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardPrompt',
  input: {schema: GenerateFlashcardInputSchema},
  output: {schema: GenerateFlashcardOutputSchema},
  prompt: `You are an assistant that creates flashcards for language learners.
The user's spoken language is {{{spokenLanguage}}} and they are learning {{{learningLanguage}}}.

Based on the user input '{{{topicOrWord}}}', generate a single flashcard.

- If the input seems like a general topic (e.g., "fruits", "travel vocabulary", "common verbs"), provide a relevant word or short phrase from that topic in {{{learningLanguage}}} and its direct translation in {{{spokenLanguage}}}.
- If the input seems like a specific word or phrase in either {{{learningLanguage}}} or {{{spokenLanguage}}}, provide its translation in the other language.
- Ensure the learningTerm is in {{{learningLanguage}}} and spokenTerm is in {{{spokenLanguage}}}.
- Optionally, suggest a concise category for this flashcard (e.g., "Food", "Travel", "Verbs", "Adjectives").

Return ONLY the JSON object with "learningTerm", "spokenTerm", and "category" (if applicable).
Example for input "apple", learning "French", spoken "English":
{ "learningTerm": "pomme", "spokenTerm": "apple", "category": "Fruit" }

Example for input "colors", learning "Spanish", spoken "English":
{ "learningTerm": "azul", "spokenTerm": "blue", "category": "Colors" }
`,
});

const generateFlashcardFlow = ai.defineFlow(
  {
    name: 'generateFlashcardFlow',
    inputSchema: GenerateFlashcardInputSchema,
    outputSchema: GenerateFlashcardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate flashcard output.");
    }
    return output;
  }
);
