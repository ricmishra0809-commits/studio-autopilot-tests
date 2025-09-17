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
        model: 'googleai/gemini-2.5-flash',
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
        justification: z.string().describe('Why you are clicking this element.'),
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
        justification: z.string().describe('Why you are filling this field.'),
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
        description: 'Asserts that an element is visible on the page.',
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
            justification: z.string().describe('Why you are scrolling.'),
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
            description: 'Presses a key on the keyboard, like "Enter".',
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
        description: 'Analyzes the current page screenshot to answer questions about visual elements, layout, and style. Use this to check for visual bugs.',
        inputSchema: z.object({
        query: z.string().describe('The question to ask about the screenshot (e.g., "Is the main title centered?", "Is there any overlapping text?").'),
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
        model: 'googleai/gemini-2.5-flash',
        });
        return result.text;
    }
    );

    await playwrightService.goTo(input.url);

    let steps = [];
    let cumulativePrompt = `You are an AI Test Agent with Self-Healing capabilities. Your goal is to test a web application by exploring it to complete a task.
You can see the screen and interact with it using the provided tools. If a selector for an element is not working, you can use the 'findAlternativeSelector' tool to attempt to self-heal the test. You can also use the 'analyzeVisuals' tool to check for UI/UX issues.

Your task is: ${input.task}
The current URL is: ${input.url}
The emulated device is: ${input.device || 'Desktop'}

Analyze the screenshot and decide what action to take next to accomplish the task.
Think step-by-step. What is the most logical next action? If a previous action failed, consider why and try to recover.
`;

    for (let i = 0; i < 7; i++) { // Limit to 7 steps for now
        const screenshot = await playwrightService.getPageAsDataUri();

        const agentResponse = await ai.generate({
            prompt: [
                { role: 'user', content: cumulativePrompt},
                { role: 'user', content: { media: { url: screenshot } } },
            ],
            tools: [clickTool, fillInFieldTool, assertElementTool, scrollTool, pressKeyTool, findAlternativeSelector, analyzeVisualsTool],
            model: 'googleai/gemini-2.5-flash',
        });
        
        const action = agentResponse.toolRequest?.tool.name || 'observe';
        const actionInput = agentResponse.toolRequest?.input;

        let observation = '';
        if (agentResponse.text) {
          observation = agentResponse.text;
        } else if (action !== 'observe' && actionInput.justification) {
          observation = actionInput.justification;
        } else {
            observation = 'The agent decided to finish the session.'
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
        `;
    }

    const performance = await playwrightService.getPagePerformanceMetrics();
    const dom = await playwrightService.getPageContent();
    const video = await playwrightService.closeAndGetVideo();

    const finalAnalysisPrompt = `Based on the following steps and observations, summarize the testing session for the task: "${input.task}".

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

    return {
        summary: summary.text,
        steps: steps,
        video: video || undefined,
    };
}
