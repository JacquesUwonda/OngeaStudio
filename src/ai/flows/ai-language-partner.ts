
'use server';
/**
 * @fileOverview An AI language partner for learners.
 *
 * - aiLanguagePartner - A function that provides an AI chatbot for language learning.
 * - AiLanguagePartnerInput - The input type for the aiLanguagepartner function.
 * - AiLanguagePartnerOutput - The return type for the aiLanguagepartner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLanguagePartnerInputSchema = z.object({
  message: z.string().describe('The user message to the AI language partner.'),
  learningLanguage: z.string().describe('The language the user is learning (e.g., "French", "Spanish").'),
  spokenLanguage: z.string().describe('The user primary language (e.g., "English").'),
});
export type AiLanguagePartnerInput = z.infer<typeof AiLanguagePartnerInputSchema>;

export type AiLanguagePartnerOutput = string;

export async function aiLanguagePartner(input: AiLanguagePartnerInput): Promise<AiLanguagePartnerOutput> {
  const prompt = `You are an AI language partner.
The user is learning ${input.learningLanguage} and their main language is ${input.spokenLanguage}.

Your primary goal is to help the user learn ${input.learningLanguage}.
Converse with the user primarily in their **spoken language**: ${input.spokenLanguage}.

When the user asks for a translation of a word or phrase:
- If they provide text in ${input.learningLanguage}, translate it to ${input.spokenLanguage}.
- If they provide text in ${input.spokenLanguage}, translate it to ${input.learningLanguage}.
Provide the translation directly, explained in ${input.spokenLanguage}.

When the user asks for grammar tips or explanations related to ${input.learningLanguage}:
- Provide clear and concise explanations in ${input.spokenLanguage}.
- You should use examples in ${input.learningLanguage} to illustrate the grammar points.

If the user sends a message in ${input.learningLanguage} to practice:
- You can offer corrections or brief feedback on their ${input.learningLanguage} usage (explained in ${input.spokenLanguage}).
- Continue the main conversation flow in ${input.spokenLanguage}.

User's message: ${input.message}
`;

  const { text } = await ai.generate({
    prompt: prompt,
  });

  return text;
}
