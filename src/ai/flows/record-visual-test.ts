'use server';
/**
 * @fileOverview An AI flow that provides a visual test recording experience.
 * It uses Playwright in the backend to manage browser sessions and capture screenshots.
 */
import { ai } from '@/ai/genkit';
import { PlaywrightService } from '@/services/playwright';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

// In-memory session store for simplicity
const sessions = new Map<string, { service: PlaywrightService; actions: any[] }>();

const VisualTestSessionInputSchema = z.object({
  sessionId: z.string().optional().describe('The current session ID. If not provided, a new session is created.'),
  url: z.string().url().optional().describe('The URL to start the session with. Only needed for new sessions.'),
  action: z.enum(['start', 'click', 'finish']).describe('The action to perform.'),
  x: z.number().optional().describe('The x-coordinate of a click action.'),
  y: z.number().optional().describe('The y-coordinate of a click action.'),
});
export type VisualTestSessionInput = z.infer<typeof VisualTestSessionInputSchema>;

const VisualTestSessionOutputSchema = z.object({
  sessionId: z.string().describe('The ID for the current session.'),
  screenshot: z.string().describe('A base64 encoded screenshot of the current page as a data URI.'),
  recordedActions: z.array(z.string()).optional().describe('A list of recorded actions.'),
  generatedWorkflow: z.any().optional().describe('The final generated workflow.'),
  error: z.string().optional().describe('Any error that occurred.'),
});
export type VisualTestSessionOutput = z.infer<typeof VisualTestSessionOutputSchema>;


export async function manageVisualTestSession(input: VisualTestSessionInput): Promise<VisualTestSessionOutput> {
    
    if (input.action === 'start') {
        if (!input.url) {
            return { sessionId: '', screenshot: '', error: 'URL is required to start a new session.' };
        }
        const sessionId = uuidv4();
        const service = await PlaywrightService.getInstance();
        await service.goTo(input.url);
        const screenshot = await service.getPageAsDataUri();
        sessions.set(sessionId, { service, actions: [`// Test for ${input.url}`] });
        return { sessionId, screenshot };
    }

    if (!input.sessionId || !sessions.has(input.sessionId)) {
        return { sessionId: '', screenshot: '', error: 'Invalid or expired session.' };
    }

    const session = sessions.get(input.sessionId)!;

    if (input.action === 'finish') {
        const video = await session.service.closeAndGetVideo();
        const generatedWorkflow = {
            actions: session.actions,
            videoUri: video,
        };
        sessions.delete(input.sessionId);
        return { sessionId: input.sessionId, screenshot: '', generatedWorkflow };
    }

    if (input.action === 'click') {
        const { x, y } = input;

        // Use AI to determine the best selector for the click
        const dom = await session.service.getPageContent();
        const analysisPrompt = `
            You are an expert Test Automation Engineer.
            Analyze the following HTML DOM. A user clicked at coordinates (x: ${x}, y: ${y}).
            Based on the DOM, determine the most specific and robust CSS selector for the element at or near these coordinates.
            Return ONLY the CSS selector as a string.

            DOM:
            ${dom.substring(0, 5000)}
        `;
        const selectorResponse = await ai.generate({ prompt: analysisPrompt });
        const selector = selectorResponse.text.trim();

        if (selector) {
            try {
                await session.service.click(selector);
                session.actions.push(`await page.click('${selector}');`);
            } catch (e: any) {
                return { sessionId: input.sessionId, screenshot: await session.service.getPageAsDataUri(), error: `Failed to click selector: ${selector}. Error: ${e.message}` };
            }
        } else {
             return { sessionId: input.sessionId, screenshot: await session.service.getPageAsDataUri(), error: `Could not determine a selector for the click coordinates.` };
        }
    }

    const screenshot = await session.service.getPageAsDataUri();
    return { sessionId: input.sessionId, screenshot, recordedActions: session.actions };
}
