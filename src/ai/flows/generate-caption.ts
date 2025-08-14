'use server';

/**
 * @fileOverview A flow that generates captions for video clips.
 *
 * - generateCaption - A function that generates captions for a video clip.
 * - GenerateCaptionInput - The input type for the generateCaption function.
 * - GenerateCaptionOutput - The return type for the generateCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionInputSchema = z.object({
  videoLink: z.string().describe('The link to the video.'),
  description: z.string().describe('The description of the video content.'),
});
export type GenerateCaptionInput = z.infer<typeof GenerateCaptionInputSchema>;

const GenerateCaptionOutputSchema = z.object({
  captions: z.string().describe('The generated captions for the video.'),
});
export type GenerateCaptionOutput = z.infer<typeof GenerateCaptionOutputSchema>;

export async function generateCaption(input: GenerateCaptionInput): Promise<GenerateCaptionOutput> {
  return generateCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionPrompt',
  input: {schema: GenerateCaptionInputSchema},
  output: {schema: GenerateCaptionOutputSchema},
  prompt: `You are an expert in generating engaging captions for video clips.

  Based on the video description: {{{description}}}, generate a suitable caption for the video.
  The video can be found at this link: {{{videoLink}}}.
  The caption should be concise and attention-grabbing.
  The caption should be no more than 200 characters.
  `,
});

const generateCaptionFlow = ai.defineFlow(
  {
    name: 'generateCaptionFlow',
    inputSchema: GenerateCaptionInputSchema,
    outputSchema: GenerateCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
