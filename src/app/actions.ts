'use server';

import { z } from 'zod';
import { generateMenuItemDescription } from '@/ai/flows/generate-menu-item-description';

const descriptionSchema = z.object({
  ingredients: z.string().min(3, 'Please list at least one ingredient.'),
  style: z.string().min(3, 'Please describe the style.'),
});

export async function createAIDescription(
  prevState: any,
  formData: FormData
) {
  const validatedFields = descriptionSchema.safeParse({
    ingredients: formData.get('ingredients'),
    style: formData.get('style'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateMenuItemDescription(validatedFields.data);
    return {
      description: result.description,
    };
  } catch (error) {
    return {
      error: 'Failed to generate description. Please try again.',
    };
  }
}
