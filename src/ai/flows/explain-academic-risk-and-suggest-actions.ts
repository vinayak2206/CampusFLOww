'use server';
/**
 * @fileOverview This file defines a Genkit flow to explain academic risk and suggest preventive actions.
 *
 * - explainAcademicRiskAndSuggestActions - A function that explains academic risk and suggests actions.
 * - ExplainAcademicRiskAndSuggestActionsInput - The input type for the explainAcademicRiskAndSuggestActions function.
 * - ExplainAcademicRiskAndSuggestActionsOutput - The return type for the explainAcademicRiskAndSuggestActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAcademicRiskAndSuggestActionsInputSchema = z.object({
  attendance: z
    .number()
    .describe('The attendance percentage of the student.'),
  assignmentsMissed: z
    .number()
    .describe('The number of assignments missed by the student.'),
  productivityScore: z
    .number()
    .describe('The productivity score of the student (0-100).'),
  stressLevel: z
    .number()
    .describe('The self-reported stress level of the student (1-5).'),
  academicRisk: z
    .string()
    .describe('The overall academic risk level of the student (Low, Medium, High).'),
});
export type ExplainAcademicRiskAndSuggestActionsInput = z.infer<
  typeof ExplainAcademicRiskAndSuggestActionsInputSchema
>;

const ExplainAcademicRiskAndSuggestActionsOutputSchema = z.object({
  explanation: z
    .string()
    .describe('An explanation of the reasons behind the academic risk score.'),
  suggestions: z
    .string()
    .describe('Preventive actions the student can take to improve their academic standing.'),
});
export type ExplainAcademicRiskAndSuggestActionsOutput = z.infer<
  typeof ExplainAcademicRiskAndSuggestActionsOutputSchema
>;

export async function explainAcademicRiskAndSuggestActions(
  input: ExplainAcademicRiskAndSuggestActionsInput
): Promise<ExplainAcademicRiskAndSuggestActionsOutput> {
  return explainAcademicRiskAndSuggestActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAcademicRiskAndSuggestActionsPrompt',
  input: {schema: ExplainAcademicRiskAndSuggestActionsInputSchema},
  output: {schema: ExplainAcademicRiskAndSuggestActionsOutputSchema},
  prompt: `You are an AI academic advisor providing personalized feedback to students.

  Based on the student's academic metrics, explain the reasons behind their academic risk score and suggest preventive actions.
  Be supportive, not strict. Focus on actionable, short tasks. Avoid generic advice. Use student-friendly language.

  Academic Risk: {{{academicRisk}}}
  Attendance: {{{attendance}}}%
  Assignments Missed: {{{assignmentsMissed}}}
  Productivity Score: {{{productivityScore}}}
  Stress Level: {{{stressLevel}}}/5

  Explanation:
  Suggestions:`,
});

const explainAcademicRiskAndSuggestActionsFlow = ai.defineFlow(
  {
    name: 'explainAcademicRiskAndSuggestActionsFlow',
    inputSchema: ExplainAcademicRiskAndSuggestActionsInputSchema,
    outputSchema: ExplainAcademicRiskAndSuggestActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
