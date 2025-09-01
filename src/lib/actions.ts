
"use server";

import { generateStory as generateStoryFlow, GenerateStoryInput, GenerateStoryOutput } from "@/ai/flows/generate-story";
import { aiLanguagePartner as aiLanguagePartnerFlow, AiLanguagePartnerInput, AiLanguagePartnerOutput } from "@/ai/flows/ai-language-partner";
import { generateFlashcards as generateFlashcardsFlow, GenerateFlashcardsInput } from "@/ai/flows/generate-flashcard-flow";
import { textToSpeech as textToSpeechFlow, TextToSpeechInput, TextToSpeechOutput } from "@/ai/flows/text-to-speech";
import { rolePlayingScenario as rolePlayingScenarioFlow, RolePlayingScenarioInput, RolePlayingScenarioOutput } from "@/ai/flows/role-playing-scenario";
import { livingStory as livingStoryFlow, LivingStoryInput, LivingStoryOutput } from "@/ai/flows/living-story-flow";
import { ai } from "@/ai/genkit";
import prisma from "./prisma";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './auth';
import { redirect } from 'next/navigation';

// Define the structure of a single flashcard item as expected by the frontend after processing
export interface ProcessedFlashcard {
  learningTerm: string;
  spokenTerm: string;
}

// Define the output type for the action, which is an array of these processed flashcards
export type GenerateFlashcardsActionOutput = ProcessedFlashcard[];


export async function generateStoryAction(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  try {
    const storyData = await generateStoryFlow(input);
    if (!storyData || !storyData.story || !storyData.title) {
      throw new Error("AI failed to generate a valid story.");
    }
    return storyData;
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story. Please try again.");
  }
}

export async function aiLanguagePartnerAction(input: AiLanguagePartnerInput): Promise<AiLanguagePartnerOutput> {
    try {
        const response = await aiLanguagePartnerFlow(input);
        return response;
    } catch (error) {
        console.error("Error in AI language partner action:", error);
        throw new Error("Failed to get response from AI. Please try again.");
    }
}


export async function translateSentenceAction(sentence: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    const prompt = `Translate the following from ${sourceLanguage} to ${targetLanguage}.
Do not add any extra commentary, conversation, or explanation.
Return ONLY the translated text.

Sentence to translate: "${sentence}"`;

    const { text } = await ai.generate({
      prompt: prompt,
    });
    
    // Clean up the response to remove potential quotes or extra phrases.
    return text.trim().replace(/^"|"$/g, '');
  } catch (error) {
    console.error("Error translating sentence:", error);
    throw new Error("Translation failed. Please try again.");
  }
}


export async function generateFlashcardsAction(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsActionOutput> {
  try {
    const aiResult = await generateFlashcardsFlow(input);
    if (!aiResult || !aiResult.flashcards || aiResult.flashcards.length === 0) {
      throw new Error("AI failed to generate valid flashcards.");
    }
    return aiResult.flashcards.map(fc => ({
        learningTerm: fc.learningTerm,
        spokenTerm: fc.spokenTerm,
    }));
  } catch (error) {
    console.error("Error generating flashcard set:", error);
    throw new Error("Failed to generate flashcard set. Please try again.");
  }
}

export async function textToSpeechAction(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    try {
        const result = await textToSpeechFlow(input);
        if (!result || !result.audioDataUri) {
            throw new Error("AI failed to generate audio.");
        }
        return result;
    } catch (error) {
        console.error("Error in text-to-speech action:", error);
        throw new Error("Failed to generate audio. Please try again.");
    }
}

export async function rolePlayingScenarioAction(input: RolePlayingScenarioInput): Promise<RolePlayingScenarioOutput> {
    try {
        const response = await rolePlayingScenarioFlow(input);
        return response;
    } catch (error) {
        console.error("Error in AI role-playing scenario action:", error);
        throw new Error("Failed to get response from AI character. Please try again.");
    }
}

export async function livingStoryAction(input: LivingStoryInput): Promise<LivingStoryOutput> {
    try {
        const response = await livingStoryFlow(input);
        return response;
    } catch (error) {
        console.error("Error in living story action:", error);
        throw new Error("Failed to get response from AI character. Please try again.");
    }
}

// --- AUTH ACTIONS ---

const signUpSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    spokenLanguage: z.string(),
    learningLanguage: z.string(),
});

export async function signUpAction(prevState: any, formData: FormData) {
    const validatedFields = signUpSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.data) {
        return {
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { fullName, email, password, spokenLanguage, learningLanguage } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { message: "An account with this email already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                spokenLanguage,
                learningLanguage,
            },
        });

        await createSession(newUser.id);
        
    } catch (error) {
        console.error("Sign up error:", error);
        return { message: "An unexpected error occurred. Please try again." };
    }

    redirect('/dashboard');
}


const signInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string(),
});


export async function signInAction(prevState: any, formData: FormData) {
    const validatedFields = signInSchema.safeParse(Object.fromEntries(formData.entries()));
    
    if (!validatedFields.data) {
        return {
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: "Invalid email or password." };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { message: "Invalid email or password." };
        }

        await createSession(user.id);
        
    } catch (error) {
        console.error("Sign in error:", error);
        return { message: "An unexpected error occurred. Please try again." };
    }

    redirect('/dashboard');
}

export async function signOutAction() {
    await deleteSession();
}
