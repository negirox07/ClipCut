'use server';
/**
 * @fileOverview A flow that generates video clips.
 *
 * - generateVideo - A function that handles the video generation process.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MediaPart} from 'genkit/media';

const GenerateVideoInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the source YouTube video.'),
  prompt: z.string().describe('The prompt for generating the video clip.'),
  durationSeconds: z.number().optional().describe('The duration of the clip in seconds.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  video: z.string().describe("The generated video as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async (input) => {
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: input.prompt,
      config: {
        durationSeconds: input.durationSeconds || 5,
        aspectRatio: '16:9',
      },
    });
    
    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }
  
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  
    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }
  
    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video || !video.media) {
      throw new Error('Failed to find the generated video');
    }

    return {
        video: video.media.url
    };
  }
);
