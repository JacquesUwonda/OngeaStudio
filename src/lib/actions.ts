
"use server";

import { generateStory as generateStoryFlow, GenerateStoryInput, GenerateStoryOutput } from "@/ai/flows/generate-story";
import { aiLanguagePartner as aiLanguagePartnerFlow, AiLanguagePartnerInput, AiLanguagePartnerOutput } from "@/ai/flows/ai-language-partner";
import { generateFlashcard as generateFlashcardFlow, GenerateFlashcardInput, GenerateFlashcardOutput } from "@/ai/flows/generate-flashcard-flow";


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
    if (!response || !response.response) {
      throw new Error("AI failed to provide a response.");
    }
    return response;
  } catch (error) {
    console.error("Error with AI language partner:", error);
    throw new Error("Failed to get response from AI partner. Please try again.");
  }
}

export async function translateSentenceAction(sentence: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    const promptMessage = `Translate the following sentence from ${sourceLanguage} to ${targetLanguage} and provide ONLY the ${targetLanguage} translation: "${sentence}"`;
    
    const input: AiLanguagePartnerInput = {
      message: promptMessage,
      learningLanguage: sourceLanguage, 
      spokenLanguage: targetLanguage,   
    };
    const result = await aiLanguagePartnerFlow(input);
    return result.response.trim();
  } catch (error) {
    console.error("Error translating sentence:", error);
    return "Translation failed.";
  }
}

export async function generateFlashcardAction(input: GenerateFlashcardInput): Promise<GenerateFlashcardOutput> {
  try {
    const flashcardData = await generateFlashcardFlow(input);
    if (!flashcardData || !flashcardData.learningTerm || !flashcardData.spokenTerm) {
      throw new Error("AI failed to generate a valid flashcard.");
    }
    return flashcardData;
  } catch (error)
 {
    console.error("Error generating flashcard:", error);
    throw new Error("Failed to generate flashcard. Please try again.");
  }
}
