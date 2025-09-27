'use server';

/**
 * @fileOverview AI-powered suggestions for improving Firestore Security Rules.
 */
import { callOpenRouterWithJson } from '@/lib/openrouter';
import { z } from 'zod';

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
  const prompt = `You are a security expert specializing in Firestore Security Rules.

You will review the provided Firestore Security Rules and Firestore schema and suggest improvements to enhance security.
Explain why each suggested improvement is important.

Firestore Schema:
${input.firestoreSchema}

Firestore Security Rules:
${input.securityRules}

Return the output as a JSON object that strictly follows this Zod schema:
${JSON.stringify(SuggestSecurityRuleImprovementsOutputSchema.shape)}
`;

    return callOpenRouterWithJson<SuggestSecurityRuleImprovementsOutput>({
        model: 'xai/grok-4-fast',
        messages: [{ role: 'user', content: prompt }]
    });
}
