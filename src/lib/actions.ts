
"use server";

import { generateStory as generateStoryFlow, GenerateStoryInput, GenerateStoryOutput } from "@/ai/flows/generate-story";
import { aiLanguagePartner as aiLanguagePartnerFlow, AiLanguagePartnerInput, AiLanguagePartnerOutput } from "@/ai/flows/ai-language-partner";

export async function generateStoryAction(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  try {
    // learningLanguage and spokenLanguage are now part of GenerateStoryInput
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
    // learningLanguage and spokenLanguage are now part of AiLanguagePartnerInput
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
      learningLanguage: sourceLanguage, // Context for the AI model
      spokenLanguage: targetLanguage,   // Context for the AI model
    };
    const result = await aiLanguagePartnerFlow(input);
    
    // The prompt asks for ONLY the translation, so we expect the response to be just that.
    // We can add more sophisticated extraction logic if the AI doesn't always comply.
    return result.response.trim();
  } catch (error) {
    console.error("Error translating sentence:", error);
    return "Translation failed.";
  }
}
