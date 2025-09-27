'use server';
/**
 * @fileOverview An AI agent that explores a web application and tests it.
 *
 * - exploreAndTestApp - A function that initiates the AI testing agent.
 */

import { ai } from '@/ai/genkit';
import { PlaywrightService } from '@/services/playwright';
import { z } from 'genkit';
import type { ExploreAndTestAppInput, ExploreAndTestAppOutput } from '@/ai/schemas/explore-and-test-app';
import { ExploreAndTestAppInputSchema } from '@/ai/schemas/explore-and-test-app';
import { saveTestResult } from '@/services/firestore';


export async function exploreAndTestApp(input: ExploreAndTestAppInput): Promise<ExploreAndTestAppOutput> {
    const playwrightService = await PlaywrightService.getInstance(input.device);

    // Self-healing tool
    const findAlternativeSelector = ai.defineTool(
    {
        name: 'findAlternativeSelector',
        description: 'Finds an alternative CSS selector for an element if the original selector fails. Use this if you believe the element exists but the selector is outdated.',
        inputSchema: z.object({
        originalSelector: z.string().describe('The original, failing CSS selector.'),
        elementDescription: z.string().describe('A description of the element you are trying to find (e.g., "a login button", "the main heading").'),
        }),
        outputSchema: z.string().describe('A new, valid CSS selector, or an empty string if no alternative was found.'),
    },
    async ({ originalSelector, elementDescription }) => {
        const dom = await playwrightService.getPageContent();
        const result = await ai.generate({
        prompt: `Analyze the following HTML DOM. Find a robust CSS selector for an element described as "${elementDescription}". The old selector was "${originalSelector}". Return only the new selector, or an empty string if you cannot find a suitable one.

DOM:
${dom}`,
        model: 'google/gemini-flash-1.5',
        });
        // Validate the new selector before returning
        const newSelector = result.text.trim();
        if (newSelector) {
            const isVisible = await playwrightService.isVisible(newSelector);
            if (isVisible) {
                return newSelector;
            }
        }
        return '';
    }
    );


    const clickTool = ai.defineTool(
    {
        name: 'clickElement',
        description: 'Clicks on an element on the page, specified by a CSS selector.',
        inputSchema: z.object({
        selector: z.string().describe('The CSS selector of the element to click.'),
        justification: z.string().describe('Why you are clicking this element to progress the task.'),
        }),
        outputSchema: z.void(),
    },
    async ({ selector }) => {
        await playwrightService.click(selector);
    }
    );

    const fillInFieldTool = ai.defineTool(
    {
        name: 'fillInField',
        description: 'Fills in an input field on the page.',
        inputSchema: z.object({
        selector: z.string().describe('The CSS selector of the input field.'),
        value: z.string().describe('The value to fill in the field.'),
        justification: z.string().describe('Why you are filling this field to progress the task.'),
        }),
        outputSchema: z.void(),
    },
    async ({ selector, value }) => {
        await playwrightService.fill(selector, value);
    }
    );

    const assertElementTool = ai.defineTool(
    {
        name: 'assertElement',
        description: 'Asserts that an element is visible on the page. Use this to verify a step was successful.',
        inputSchema: z.object({
        selector: z.string().describe('The CSS selector of the element to check.'),
        justification: z.string().describe('Why you are asserting this element is visible.'),
        }),
        outputSchema: z.string(),
    },
    async ({ selector }) => {
        const isVisible = await playwrightService.isVisible(selector);
        return isVisible ? `Assertion successful: Element "${selector}" is visible.` : `Assertion failed: Element "${selector}" is not visible.`;
    }
    );

    const scrollTool = ai.defineTool(
    {
        name: 'scrollPage',
        description: 'Scrolls the page down to reveal more content.',
        inputSchema: z.object({
            direction: z.enum(['down', 'up']).describe('The direction to scroll.'),
            justification: z.string().describe('Why you are scrolling the page.'),
        }),
        outputSchema: z.void(),
    },
    async ({ direction }) => {
        await playwrightService.scroll(direction);
    }
    );

    const pressKeyTool = ai.defineTool(
        {
            name: 'pressKey',
            description: 'Presses a key on the keyboard, like "Enter". Useful for submitting forms.',
            inputSchema: z.object({
                key: z.string().describe('The key to press (e.g., "Enter", "Tab").'),
                selector: z.string().optional().describe('The CSS selector of an element to focus before pressing the key.'),
                justification: z.string().describe('Why you are pressing this key.'),
            }),
            outputSchema: z.void(),
        },
        async ({ key, selector }) => {
            await playwrightService.pressKey(key, selector);
        }
    );

    const analyzeVisualsTool = ai.defineTool(
    {
        name: 'analyzeVisuals',
        description: 'Analyzes the current page screenshot to answer questions about visual elements, layout, and style. Use this to understand what is on the screen.',
        inputSchema: z.object({
        query: z.string().describe('The question to ask about the screenshot (e.g., "Is there a login button?", "What is the main heading text?").'),
        justification: z.string().describe('Why you are analyzing the visuals.'),
        }),
        outputSchema: z.string().describe('The answer to your visual query.'),
    },
    async ({ query }) => {
        const screenshot = await playwrightService.getPageAsDataUri();
        const result = await ai.generate({
        prompt: [
            { role: 'user', content: `You are a UI/UX expert. Analyze the following screenshot and answer the question. Be concise. Question: ${query}`},
            { role: 'user', content: { media: { url: screenshot } } },
        ],
        model: 'google/gemini-flash-1.5',
        });
        return result.text;
    }
    );

    await playwrightService.goTo(input.url);

    let steps = [];
    let cumulativePrompt = `You are a powerful AI Web Assistant. Your goal is to complete a user-defined task on a web application.
You operate like a human: you look at the screen, think, and then act. You have a set of tools to interact with the page (click, type, scroll, etc.).
If one of your actions fails (e.g., a selector is invalid), you can use 'findAlternativeSelector' to try and self-heal.

Your mission is to complete the following task: ${input.task}

The current URL is: ${input.url}
The emulated device is: ${input.device || 'Desktop'}

Analyze the screenshot. Think step-by-step. What is the most logical next action to accomplish the task?
If you believe you have completed the task, use the 'observe' action to finish the session with a final thought.
`;

    for (let i = 0; i < 7; i++) { // Limit to 7 steps for now
        const screenshot = await playwrightService.getPageAsDataUri();

        const agentResponse = await ai.generate({
            prompt: [
                { role: 'user', content: cumulativePrompt},
                { role: 'user', content: { media: { url:screenshot } } },
            ],
            tools: [clickTool, fillInFieldTool, assertElementTool, scrollTool, pressKeyTool, findAlternativeSelector, analyzeVisualsTool],
            model: 'google/gemini-flash-1.5',
        });
        
        const action = agentResponse.toolRequest?.tool.name || 'observe';
        const actionInput = agentResponse.toolRequest?.input;

        let observation = '';
        if (agentResponse.text) {
          observation = agentResponse.text;
        } else if (action !== 'observe' && actionInput.justification) {
          observation = actionInput.justification;
        } else {
            observation = 'The agent has completed the task and is finishing the session.'
        }
        
        let toolResult = '';
        if (action === 'observe' || !agentResponse.toolRequest) {
            steps.push({
              action: `observe()`,
              screenshot,
              observation: observation,
            });
            break; // Agent decided to stop
        } else {
          try {
            const toolResponse = await agentResponse.runTool();
            if(toolResponse) {
              toolResult = `Tool Output: ${toolResponse}`;
              observation += `\n${toolResult}`;
            }
            steps.push({
              action: `${action}(${JSON.stringify(actionInput) || ''})`,
              screenshot,
              observation: observation,
            });
          } catch(e: any) {
             toolResult = `Tool Error: ${e.message}. The selector might be invalid. I will try to find an alternative selector.`;
             observation += `\n${toolResult}`;
             steps.push({
                action: `${action}(${JSON.stringify(actionInput) || ''}) - FAILED`,
                screenshot,
                observation,
             })
          }
        }
        
        cumulativePrompt += `
        Step ${i + 1}:
        - Observation: ${observation}
        - Action: ${action} with input ${JSON.stringify(actionInput)}
        - Result: ${toolResult || 'No output.'}
        
        Now, analyze the new screenshot and decide the next action. If the previous step failed, consider using 'findAlternativeSelector' to self-heal.
        Have you completed the task? If so, you can finish. Otherwise, continue to the next logical step.
        `;
    }

    const performance = await playwrightService.getPagePerformanceMetrics();
    const dom = await playwrightService.getPageContent();
    const video = await playwrightService.closeAndGetVideo();

    const finalAnalysisPrompt = `Based on the following steps and observations, create a final summary for the user about how you completed the task: "${input.task}".

Also, provide a brief "Performance and Security Insights" section.
- For performance, analyze these metrics: ${JSON.stringify(performance)}. Was the page load fast?
- For security, analyze the final DOM for any broken links (<a> tags with empty href) or obvious issues.

DOM:
${dom}

Testing Steps:
${steps.map((s, i) => `Step ${i+1}: ${s.observation}\nAction: ${s.action}`).join('\n\n')}
`;


    const summary = await ai.generate({
        prompt: finalAnalysisPrompt
    });

    const result = {
        summary: summary.text,
        steps: steps,
        video: video || undefined,
    };
    
    // Save the result to Firestore
    await saveTestResult({
        ...result,
        url: input.url,
        task: input.task,
        video: video || null,
    });

    return result;
}
