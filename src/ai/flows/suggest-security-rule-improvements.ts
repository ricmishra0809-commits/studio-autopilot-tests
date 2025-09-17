'use server';

/**
 * @fileOverview AI-powered suggestions for improving Firestore Security Rules.
 *
 * - suggestSecurityRuleImprovements - A function that suggests improvements to Firestore Security Rules.
 * - SuggestSecurityRuleImprovementsInput - The input type for the suggestSecurityRuleImprovements function.
 * - SuggestSecurityRuleImprovementsOutput - The return type for the suggestSecurityRuleImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSecurityRuleImprovementsInputSchema = z.object({
  securityRules: z
    .string()
    .describe('The current Firestore Security Rules to be reviewed.'),
  firestoreSchema: z
    .string()
    .describe('The Firestore schema (collection and document structure).'),
});
export type SuggestSecurityRuleImprovementsInput = z.infer<
  typeof SuggestSecurityRuleImprovementsInputSchema
>;

const SuggestSecurityRuleImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'AI-powered suggestions for improving the provided Firestore Security Rules.'
    ),
  explanation: z
    .string()
    .describe(
      'Explanation of why the suggested improvements are important for security.'
    ),
});
export type SuggestSecurityRuleImprovementsOutput = z.infer<
  typeof SuggestSecurityRuleImprovementsOutputSchema
>;

export async function suggestSecurityRuleImprovements(
  input: SuggestSecurityRuleImprovementsInput
): Promise<SuggestSecurityRuleImprovementsOutput> {
  return suggestSecurityRuleImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSecurityRuleImprovementsPrompt',
  input: {schema: SuggestSecurityRuleImprovementsInputSchema},
  output: {schema: SuggestSecurityRuleImprovementsOutputSchema},
  prompt: `You are a security expert specializing in Firestore Security Rules.

You will review the provided Firestore Security Rules and Firestore schema and suggest improvements to enhance security.
Explain why each suggested improvement is important.

Firestore Schema:
{{firestoreSchema}}

Firestore Security Rules:
{{securityRules}}`,
});

const suggestSecurityRuleImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestSecurityRuleImprovementsFlow',
    inputSchema: SuggestSecurityRuleImprovementsInputSchema,
    outputSchema: SuggestSecurityRuleImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
