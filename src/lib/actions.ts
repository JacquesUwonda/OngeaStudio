"use server";

import { generateFrenchStory as generateFrenchStoryFlow, GenerateFrenchStoryInput, GenerateFrenchStoryOutput } from "@/ai/flows/generate-french-story";
import { aiLanguagePartner as aiLanguagePartnerFlow, AiLanguagePartnerInput, AiLanguagePartnerOutput } from "@/ai/flows/ai-language-partner";

export async function generateStoryAction(input: GenerateFrenchStoryInput): Promise<GenerateFrenchStoryOutput> {
  try {
    const storyData = await generateFrenchStoryFlow(input);
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

export async function translateSentenceAction(sentence: string): Promise<string> {
  try {
    // Instruct the AI to only provide the translation.
    const input: AiLanguagePartnerInput = {
      message: `Translate the following French sentence to English and provide ONLY the English translation: "${sentence}"`,
    };
    const result = await aiLanguagePartnerFlow(input);
    
    // Simple heuristic: if the response includes "English translation:", try to extract text after it.
    // This is a fallback if the AI doesn't strictly follow "ONLY the translation".
    const translationMarker = "English translation:";
    if (result.response.includes(translationMarker)) {
      return result.response.substring(result.response.indexOf(translationMarker) + translationMarker.length).trim();
    }
    // Otherwise, assume the whole response is the translation as requested.
    return result.response.trim();
  } catch (error) {
    console.error("Error translating sentence:", error);
    return "Translation failed.";
  }
}
