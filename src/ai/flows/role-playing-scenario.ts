
'use server';
/**
 * @fileOverview An AI flow for interactive role-playing scenarios.
 *
 * - rolePlayingScenario - A function that provides an AI chatbot for specific scenarios.
 * - RolePlayingScenarioInput - The input type for the function.
 * - RolePlayingScenarioOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RolePlayingScenarioInputSchema = z.object({
  scenario: z.string().describe('The title of the role-playing scenario (e.g., "At the Restaurant").'),
  message: z.string().describe('The user message to the AI character.'),
  learningLanguage: z.string().describe('The language the user is learning (e.g., "French", "Spanish").'),
  spokenLanguage: z.string().describe('The user primary language (e.g., "English").'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
});
export type RolePlayingScenarioInput = z.infer<typeof RolePlayingScenarioInputSchema>;

export type RolePlayingScenarioOutput = string;

export async function rolePlayingScenario(input: RolePlayingScenarioInput): Promise<RolePlayingScenarioOutput> {
  const prompt = `You are an AI language practice partner. You are acting as a character in a role-playing scenario.
The user is learning ${input.learningLanguage}, and their primary language is ${input.spokenLanguage}.

SCENARIO: "${input.scenario}"

YOUR ROLE:
- Based on the scenario "${input.scenario}", you will adopt a specific role (e.g., a waiter, a hotel clerk, a shopkeeper).
- Your goal is to have a natural, interactive conversation with the user in ${input.learningLanguage}, guiding them through the scenario.
- Stay in character at all times.
- Keep your responses concise and focused on the scenario.

INSTRUCTIONS:
- Primarily communicate in ${input.learningLanguage}.
- If the user gets stuck or makes a significant error, you can offer a gentle correction or a hint. Explain the correction briefly in the user's spoken language (${input.spokenLanguage}) within parentheses, like this: (Hint: You could say...).
- Start the conversation with a greeting appropriate for your role in the scenario.
- Let the user lead the conversation, but guide them if they are unsure what to do next.

User's message: "${input.message}"
`;

  const { text } = await ai.generate({
    prompt: prompt,
    history: input.history.map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }]
    }))
  });

  return text;
}
