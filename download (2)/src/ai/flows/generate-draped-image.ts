'use server';
/**
 * @fileOverview Generates a draped image of a saree on a model using AI.
 *
 * - generateDrapedImage - A function that takes a saree fabric image and a model image, and returns a draped image of the saree on the model.
 * - GenerateDrapedImageInput - The input type for the generateDrapedImage function.
 * - GenerateDrapedImageOutput - The return type for the generateDrapedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDrapedImageInputSchema = z.object({
  sareeFabricDataUri: z
    .string()
    .describe(
      "A photo of a saree fabric, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  modelDataUri: z
    .string()
    .describe(
      "A photo of a model, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  poseDescription: z.string().optional().describe('The description of the pose of the model.'),
});
export type GenerateDrapedImageInput = z.infer<typeof GenerateDrapedImageInputSchema>;

const GenerateDrapedImageOutputSchema = z.object({
  drapedImageDataUri: z
    .string()
    .describe(
      'A data URI containing the generated image of the saree draped on the model.'
    ),
});
export type GenerateDrapedImageOutput = z.infer<typeof GenerateDrapedImageOutputSchema>;

export async function generateDrapedImage(input: GenerateDrapedImageInput): Promise<GenerateDrapedImageOutput> {
  return generateDrapedImageFlow(input);
}

const generateDrapedImageFlow = ai.defineFlow(
  {
    name: 'generateDrapedImageFlow',
    inputSchema: GenerateDrapedImageInputSchema,
    outputSchema: GenerateDrapedImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `You are an AI fashion designer specializing in virtually draping sarees on models.

You will receive an image of a saree fabric and an image of a model. Your task is to generate a realistic, high-resolution photo of the saree draped on the model.

- **Draping Style:** The saree should be draped in a standard, elegant fashion.
- **Realism:** The draping must be realistic, accurately depicting the fabric's texture, folds, and how it contours to the model's body and pose.
- **Output:** The final image must be a full-body shot of the model wearing the draped saree against a neutral, clean studio background (e.g., light gray, off-white). The output should not be a sketch or illustration; it must be a photorealistic image.
- **Pose:** Use the provided pose description. If no description is given, maintain the model's pose from the input image.

Saree Fabric Image: Provided as the first media input.
Model Image: Provided as the second media input.
Pose Description: ${input.poseDescription || 'As seen in the model image.'}`,
        },
        { media: { url: input.sareeFabricDataUri } },
        { media: { url: input.modelDataUri } },
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed. The AI model did not return an image. Please try again.');
    }
    
    return {
      drapedImageDataUri: media.url,
    };
  }
);
