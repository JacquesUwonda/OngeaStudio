
'use server';
/**
 * @fileOverview An AI language partner for learners.
 *
 * - aiLanguagePartner - A function that provides an AI chatbot for language learning.
 * - AiLanguagePartnerInput - The input type for the aiLanguagePartner function.
 * - AiLanguagePartnerOutput - The return type for the aiLanguagePartner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLanguagePartnerInputSchema = z.object({
  message: z.string().describe('The user message to the AI language partner.'),
  learningLanguage: z.string().describe('The language the user is learning (e.g., "French", "Spanish").'),
  spokenLanguage: z.string().describe('The user primary language (e.g., "English").'),
});
export type AiLanguagePartnerInput = z.infer<typeof AiLanguagePartnerInputSchema>;

const AiLanguagePartnerOutputSchema = z.object({
  response: z.string().describe('The AI language partner response, primarily in the spoken language. It includes explanations for grammar/translations regarding the learning language.'),
});
export type AiLanguagePartnerOutput = z.infer<typeof AiLanguagePartnerOutputSchema>;

export async function aiLanguagePartner(input: AiLanguagePartnerInput): Promise<AiLanguagePartnerOutput> {
  return aiLanguagePartnerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiLanguagePartnerPrompt',
  input: {schema: AiLanguagePartnerInputSchema},
  output: {schema: AiLanguagePartnerOutputSchema},
  prompt: `You are an AI language partner.
The user is learning {{{learningLanguage}}} and their main language is {{{spokenLanguage}}}.

Your primary goal is to help the user learn {{{learningLanguage}}}.
Converse with the user primarily in their **spoken language**: {{{spokenLanguage}}}.

When the user asks for a translation of a word or phrase:
- If they provide text in {{{learningLanguage}}}, translate it to {{{spokenLanguage}}}.
- If they provide text in {{{spokenLanguage}}}, translate it to {{{learningLanguage}}}.
Provide the translation directly, explained in {{{spokenLanguage}}}.

When the user asks for grammar tips or explanations related to {{{learningLanguage}}}:
- Provide clear and concise explanations in {{{spokenLanguage}}}.
- You should use examples in {{{learningLanguage}}} to illustrate the grammar points.

If the user sends a message in {{{learningLanguage}}} to practice:
- You can offer corrections or brief feedback on their {{{learningLanguage}}} usage (explained in {{{spokenLanguage}}}).
- Continue the main conversation flow in {{{spokenLanguage}}}.

User message: {{{message}}}
`,
});

const aiLanguagePartnerFlow = ai.defineFlow(
  {
    name: 'aiLanguagePartnerFlow',
    inputSchema: AiLanguagePartnerInputSchema,
    outputSchema: AiLanguagePartnerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
