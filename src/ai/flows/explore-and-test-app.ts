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

    const suggestCodeFix = ai.defineTool(
        {
            name: 'suggestCodeFix',
            description: 'When a test assertion fails, analyze the DOM and the failure to suggest a React/JSX code fix. The goal is to make the test pass.',
            inputSchema: z.object({
                failedAssertion: z.string().describe('The description of the assertion that failed (e.g., "Element with selector .main-heading was not visible").'),
                justification: z.string().describe('Your reasoning for why you think the code fix is necessary.'),
            }),
            outputSchema: z.string().describe('The suggested code snippet (React/JSX) to fix the issue. This should be a string containing the code.'),
        },
        async ({ failedAssertion }) => {
            const dom = await playwrightService.getPageContent();
            const result = await ai.generate({
                prompt: `You are an expert React/Next.js developer. An automated test failed with the error: "${failedAssertion}".
                Analyze the following DOM and suggest a React/JSX code change to fix the issue.
                Return only the code snippet that needs to be changed. Be concise.

                DOM:
                ${dom}`,
                model: 'google/gemini-flash-1.5',
            });
            return result.text;
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

    await playwrightService.goTo(input.url);

    let steps = [];
    let cumulativePrompt = `You are a powerful AI Web Assistant working in "Developer Mode". Your goal is to complete a user-defined task on a web application.
If a test assertion fails, your primary goal is to use the 'suggestCodeFix' tool to propose a code change that will make the test pass.
You operate in a loop: Act -> Observe -> Think. If an assertion fails, you must use 'suggestCodeFix'. If an action fails (like a click), you should try to self-heal.
Your mission is to ensure the user's task is completed and all assertions pass. The task is: ${input.task}

The current URL is: ${input.url}
The emulated device is: ${input.device || 'Desktop'}

Analyze the screenshot. Think step-by-step. What is the most logical next action?
If you believe you have completed the task and all assertions have passed, use the 'observe' action to finish the session.
`;

    for (let i = 0; i < 7; i++) { // Limit to 7 steps
        const screenshot = await playwrightService.getPageAsDataUri();

        const agentResponse = await ai.generate({
            prompt: [
                { role: 'user', content: cumulativePrompt},
                { role: 'user', content: { media: { url:screenshot } } },
            ],
            tools: [clickTool, fillInFieldTool, assertElementTool, scrollTool, pressKeyTool, suggestCodeFix],
            model: 'google/gemini-flash-1.5',
        });
        
        const action = agentResponse.toolRequest?.tool.name || 'observe';
        const actionInput = agentResponse.toolRequest?.input;

        let observation = agentResponse.text || 'Performing action...';
        let toolResult = '';
        let codeSuggestion = null;
        
        if (action === 'observe' || !agentResponse.toolRequest) {
            steps.push({ action: `observe()`, screenshot, observation, codeSuggestion });
            break;
        }

        try {
            const toolResponse = await agentResponse.runTool();
            if(toolResponse) {
                toolResult = `Tool Output: ${toolResponse}`;
                // Special handling for code suggestions
                if (action === 'suggestCodeFix') {
                    codeSuggestion = toolResponse;
                    observation = `The previous assertion failed. I am suggesting a code fix to resolve the issue.`;
                }
                // Handle assertion failures
                else if (action === 'assertElement' && toolResponse.startsWith('Assertion failed')) {
                     observation = `Assertion failed. I need to call the code fix tool. The failure was: ${toolResponse}`;
                } else {
                     observation = actionInput.justification;
                }
            }
            steps.push({ action: `${action}(${JSON.stringify(actionInput) || ''})`, screenshot, observation, codeSuggestion });
        } catch(e: any) {
            toolResult = `Tool Error: ${e.message}.`;
            observation = `An action failed. ${toolResult}`;
            steps.push({ action: `${action}(${JSON.stringify(actionInput) || ''}) - FAILED`, screenshot, observation, codeSuggestion });
        }
        
        cumulativePrompt += `
        Step ${i + 1}:
        - Observation: ${observation}
        - Action: ${action} with input ${JSON.stringify(actionInput)}
        - Result: ${toolResult || 'No output.'}
        
        Now, analyze the new screenshot.
        - If an assertion failed in the previous step, YOU MUST use the 'suggestCodeFix' tool now.
        - If the task is complete and all assertions passed, you can finish.
        - Otherwise, continue to the next logical step.
        `;
    }

    const performance = await playwrightService.getPagePerformanceMetrics();
    const video = await playwrightService.closeAndGetVideo();

    const finalAnalysisPrompt = `Based on the following steps and observations, create a final summary for the user about how you completed the task: "${input.task}". Mention any code fixes you suggested.

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
    
    await saveTestResult({
        ...result,
        url: input.url,
        task: input.task,
        video: video || null,
    });

    return result;
}
