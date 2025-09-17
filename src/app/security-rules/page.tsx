'use server';
import { suggestSecurityRuleImprovements } from '@/ai/flows/suggest-security-rule-improvements';
import { SecurityRulesForm } from './_components/security-rules-form';

export default async function SecurityRulesPage() {
  async function getSuggestions(data: { securityRules: string; firestoreSchema: string }) {
    'use server';
    return await suggestSecurityRuleImprovements(data);
  }

  return <SecurityRulesForm getSuggestions={getSuggestions} />;
}
