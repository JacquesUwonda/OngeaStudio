
"use server";

import { generateStory as generateStoryFlow, GenerateStoryInput, GenerateStoryOutput } from "@/ai/flows/generate-story";
import { aiLanguagePartner as aiLanguagePartnerFlow, AiLanguagePartnerInput, AiLanguagePartnerOutput } from "@/ai/flows/ai-language-partner";
import { generateFlashcards as generateFlashcardsFlow, GenerateFlashcardsInput, GenerateFlashcardsOutput as GenerateFlashcardsAIOutput } from "@/ai/flows/generate-flashcard-flow";

// Define the structure of a single flashcard item as expected by the frontend after processing
export interface ProcessedFlashcard {
  learningTerm: string;
  spokenTerm: string;
  category?: string;
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
     // This prompt is more direct and less conversational, aiming for a pure translation.
    const promptMessage = `Translate the following from ${sourceLanguage} to ${targetLanguage}. Return ONLY the translation, with no additional text or explanations.

Sentence to translate: "${sentence}"`;

    const input: AiLanguagePartnerInput = {
      message: promptMessage,
      // We can use the source and target languages directly here.
      // The AI partner prompt is flexible enough to handle this direction.
      learningLanguage: sourceLanguage,
      spokenLanguage: targetLanguage,
    };
    
    const result = await aiLanguagepartnerFlow(input);

    // Clean up the response to remove potential quotes or extra phrases.
    return result.response.trim().replace(/^"|"$/g, '');
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
    // The AI flow already returns an array of objects with learningTerm, spokenTerm, category
    // So, we can directly return aiResult.flashcards
    return aiResult.flashcards.map(fc => ({
        learningTerm: fc.learningTerm,
        spokenTerm: fc.spokenTerm,
        category: fc.category,
    }));
  } catch (error) {
    console.error("Error generating flashcard set:", error);
    throw new Error("Failed to generate flashcard set. Please try again.");
  }
}
