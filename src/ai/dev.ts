
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-language-partner.ts';
import '@/ai/flows/generate-story.ts';
import '@/ai/flows/generate-flashcard-flow.ts';
// Note: generate-french-story.ts was removed as its functionality is covered by generate-story.ts
// If it was used elsewhere or had distinct logic, it might need to be re-evaluated.
// For now, assuming generate-story.ts is the consolidated version.

