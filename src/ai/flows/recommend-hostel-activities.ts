'use server';
/**
 * @fileOverview An AI agent that recommends hostel activities based on hostel conditions.
 *
 * - recommendHostelActivities - A function that handles the recommendation process.
 * - RecommendHostelActivitiesInput - The input type for the recommendHostelActivities function.
 * - RecommendHostelActivitiesOutput - The return type for the recommendHostelActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendHostelActivitiesInputSchema = z.object({
  noiseLevel: z.enum(['Low', 'Medium', 'High']).describe('The current noise level in the hostel.'),
  messMenu: z.string().describe('The mess menu for the day.'),
  freeSlotDuration: z.string().describe('The duration of the free time slot.'),
});
export type RecommendHostelActivitiesInput = z.infer<typeof RecommendHostelActivitiesInputSchema>;

const RecommendHostelActivitiesOutputSchema = z.object({
  activitySuggestion: z.string().describe('A suggested activity based on the hostel conditions.'),
  nutritionFeedback: z.string().describe('Simple nutrition feedback based on the mess menu.'),
});
export type RecommendHostelActivitiesOutput = z.infer<typeof RecommendHostelActivitiesOutputSchema>;

export async function recommendHostelActivities(input: RecommendHostelActivitiesInput): Promise<RecommendHostelActivitiesOutput> {
  return recommendHostelActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendHostelActivitiesPrompt',
  input: {schema: RecommendHostelActivitiesInputSchema},
  output: {schema: RecommendHostelActivitiesOutputSchema},
  prompt: `You are a helpful assistant that suggests activities for students in a hostel.

  Consider the following hostel conditions when making your recommendation:

  Noise Level: {{{noiseLevel}}}
  Mess Menu: {{{messMenu}}}
  Free Slot Duration: {{{freeSlotDuration}}}

  Please suggest an activity that is appropriate for the given conditions. Be supportive, not strict. Focus on actionable, short tasks. Avoid generic advice. Use student-friendly language.
  Also provide simple nutrition feedback based on the mess menu.
  Remember that your suggestion and feedback should be tailored towards university students.
  `,
});

const recommendHostelActivitiesFlow = ai.defineFlow(
  {
    name: 'recommendHostelActivitiesFlow',
    inputSchema: RecommendHostelActivitiesInputSchema,
    outputSchema: RecommendHostelActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
