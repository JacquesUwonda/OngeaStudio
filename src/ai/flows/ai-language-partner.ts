// This is an automatically generated file. Please do not edit.
'use server';
/**
 * @fileOverview An AI language partner for French learners.
 *
 * - aiLanguagePartner - A function that provides an AI chatbot for French language learning.
 * - AiLanguagePartnerInput - The input type for the aiLanguagePartner function.
 * - AiLanguagePartnerOutput - The return type for the aiLanguagePartner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLanguagePartnerInputSchema = z.object({
  message: z.string().describe('The user message to the AI language partner.'),
});
export type AiLanguagePartnerInput = z.infer<typeof AiLanguagePartnerInputSchema>;

const AiLanguagePartnerOutputSchema = z.object({
  response: z.string().describe('The AI language partner response in French, including grammar tips and translations if requested.'),
});
export type AiLanguagePartnerOutput = z.infer<typeof AiLanguagePartnerOutputSchema>;

export async function aiLanguagePartner(input: AiLanguagePartnerInput): Promise<AiLanguagePartnerOutput> {
  return aiLanguagePartnerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiLanguagePartnerPrompt',
  input: {schema: AiLanguagePartnerInputSchema},
  output: {schema: AiLanguagePartnerOutputSchema},
  prompt: `You are an AI language partner specializing in French.

You will converse with the user in French, providing grammar tips and translations on demand.

User message: {{{message}}}

Respond in French. If asked for a translation, provide it in English. If asked for grammar tips, provide them in French.
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
