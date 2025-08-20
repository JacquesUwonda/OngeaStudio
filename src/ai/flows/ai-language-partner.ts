
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

// The output is no longer a single object but a stream of strings
export type AiLanguagePartnerOutput = AsyncGenerator<string>;


export async function aiLanguagePartner(input: AiLanguagePartnerInput): Promise<AiLanguagePartnerOutput> {
  return aiLanguagePartnerStream(input);
}

const prompt = ai.definePrompt({
    name: 'aiLanguagePartnerPrompt',
    input: { schema: AiLanguagePartnerInputSchema },
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
`
});


async function* aiLanguagePartnerStream(input: AiLanguagePartnerInput): AiLanguagePartnerOutput {
    const {stream} = ai.generateStream({
        prompt: prompt.prompt,
        history: [{role: 'user', content: [{text: input.message}]}],
        input: input,
    });

    for await (const chunk of stream) {
        yield chunk.text;
    }
}
