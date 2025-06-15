
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
  response: z.string().describe('The AI language partner response, primarily in the learning language, including grammar tips and translations if requested.'),
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

Converse with the user primarily in {{{learningLanguage}}}.
If the user asks for a translation, translate between {{{learningLanguage}}} and {{{spokenLanguage}}}.
If the user asks for grammar tips for {{{learningLanguage}}}, provide them. You can explain these tips in {{{spokenLanguage}}} if it aids clarity, but prioritize using {{{learningLanguage}}}.

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
