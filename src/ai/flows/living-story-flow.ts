
'use server';
/**
 * @fileOverview An AI flow for chatting with a character from a generated story.
 *
 * - livingStory - A function that provides an AI chatbot for story interaction.
 * - LivingStoryInput - The input type for the function.
 * - LivingStoryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LivingStoryInputSchema = z.object({
  storyTitle: z.string().describe('The title of the story.'),
  storyContent: z.string().describe('The full content of the story.'),
  message: z.string().describe('The user message to the AI character.'),
  learningLanguage: z.string().describe('The language the user is learning and the story is in.'),
  spokenLanguage: z.string().describe('The user primary language for explanations.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
});
export type LivingStoryInput = z.infer<typeof LivingStoryInputSchema>;

export type LivingStoryOutput = string;

export async function livingStory(input: LivingStoryInput): Promise<LivingStoryOutput> {
  const prompt = `You are a character from a story, here to chat with a language learner.
The user is learning ${input.learningLanguage}, and their primary language is ${input.spokenLanguage}.

THE STORY:
Title: "${input.storyTitle}"
Content: "${input.storyContent}"

YOUR ROLE:
- You are a friendly and engaging character from within this story. You can be one of the main characters, or even a knowledgeable narrator.
- Your primary goal is to have an interactive conversation with the user in ${input.learningLanguage} about the story.
- You can answer questions about the plot, the characters' feelings, or what might happen next.
- If the user asks a question in ${input.spokenLanguage}, you can answer it, but try to gently guide the conversation back to ${input.learningLanguage}.
- If the user makes a mistake in ${input.learningLanguage}, you can offer a gentle correction in parentheses, explained in ${input.spokenLanguage}.
- Start the conversation by introducing yourself as a character from the story and asking an open-ended question about it.

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
