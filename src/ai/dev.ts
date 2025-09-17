import { config } from 'dotenv';
config();

import '@/ai/flows/generate-automated-tests.ts';
import '@/ai/flows/suggest-security-rule-improvements.ts';
import '@/ai/flows/summarize-ci-results.ts';
import '@/ai/flows/generate-test-strategy.ts';
import '@/ai/flows/explore-and-test-app.ts';
import '@/ai/flows/generate-test-video.ts';
