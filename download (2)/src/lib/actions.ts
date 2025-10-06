// This is a server-side file.
'use server';

import {
  generateDrapedImage,
  type GenerateDrapedImageInput,
} from '@/ai/flows/generate-draped-image';
import { z } from 'zod';

const ActionInputSchema = z.object({
  sareeFabricDataUri: z
    .string()
    .min(1, { message: 'Saree fabric image is required.' }),
  modelDataUri: z.string().min(1, { message: 'Model image is required.' }),
  poseDescription: z.string().optional(),
});

export async function handleDrapeSaree(input: GenerateDrapedImageInput) {
  try {
    const parsedInput = ActionInputSchema.parse(input);
    const result = await generateDrapedImage(parsedInput);
    return { drapedImageDataUri: result.drapedImageDataUri, error: null };
  } catch (error) {
    console.error('AI Draping Error:', error);
    if (error instanceof z.ZodError) {
      return {
        drapedImageDataUri: null,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    
    let errorMessage = 'An unexpected error occurred during image generation.';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return { drapedImageDataUri: null, error: errorMessage };
  }
}
