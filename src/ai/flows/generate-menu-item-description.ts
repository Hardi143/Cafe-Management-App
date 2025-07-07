'use server';
/**
 * @fileOverview An AI agent for generating menu item descriptions.
 *
 * - generateMenuItemDescription - A function that generates menu item descriptions.
 * - GenerateMenuItemDescriptionInput - The input type for the generateMenuItemDescription function.
 * - GenerateMenuItemDescriptionOutput - The return type for the generateMenuItemDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMenuItemDescriptionInputSchema = z.object({
  ingredients: z
    .string()
    .describe('The ingredients of the menu item.'),
  style: z.string().describe('The style of the menu item (e.g., Italian, French, etc.).'),
});
export type GenerateMenuItemDescriptionInput = z.infer<
  typeof GenerateMenuItemDescriptionInputSchema
>;

const GenerateMenuItemDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated description of the menu item.'),
});
export type GenerateMenuItemDescriptionOutput = z.infer<
  typeof GenerateMenuItemDescriptionOutputSchema
>;

export async function generateMenuItemDescription(
  input: GenerateMenuItemDescriptionInput
): Promise<GenerateMenuItemDescriptionOutput> {
  return generateMenuItemDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMenuItemDescriptionPrompt',
  input: {schema: GenerateMenuItemDescriptionInputSchema},
  output: {schema: GenerateMenuItemDescriptionOutputSchema},
  prompt: `You are a creative copywriter specializing in writing descriptions for menu items.

  Based on the ingredients and style, generate an enticing and descriptive menu item description.

  Ingredients: {{{ingredients}}}
  Style: {{{style}}}

  Description: `,
});

const generateMenuItemDescriptionFlow = ai.defineFlow(
  {
    name: 'generateMenuItemDescriptionFlow',
    inputSchema: GenerateMenuItemDescriptionInputSchema,
    outputSchema: GenerateMenuItemDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
