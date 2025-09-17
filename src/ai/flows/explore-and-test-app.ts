'use server';
/**
 * @fileOverview An AI agent that explores a web application and tests it.
 *
 * - exploreAndTestApp - A function that initiates the AI testing agent.
 * - ExploreAndTestAppInput - The input type for the exploreAndTestApp function.
 * - ExploreAndTestAppOutput - The return type for the exploreAndTestApp function.
 */

import { ai } from '@/ai/genkit';
import { playwrightService } from '@/services/playwright';
import { z } from 'genkit';

export const ExploreAndTestAppInputSchema = z.object({
  url: z.string().url().describe('The URL of the web application to test.'),
  task: z.string().describe('The high-level task for the AI agent to perform.'),
});
export type ExploreAndTestAppInput = z.infer<
  typeof ExploreAndTestAppInputSchema
>;

export const ExploreAndTestAppOutputSchema = z.object({
  summary: z.string().describe('A summary of the testing session.'),
  steps: z.array(
    z.object({
      action: z.string().describe('The action taken by the agent.'),
      screenshot: z.string().describe('A base64 encoded screenshot of the page after the action. As a data URI.'),
      observation: z.string().describe('The agent\'s observation after the action.'),
    })
  ),
});
export type ExploreAndTestAppOutput = z.infer<
  typeof ExploreAndTestAppOutputSchema
>;

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


export async function exploreAndTestApp(input: ExploreAndTestAppInput): Promise<ExploreAndTestAppOutput> {
    await playwrightService.goTo(input.url);

    let steps = [];
    let cumulativePrompt = `You are an AI Test Agent. Your goal is to test a web application by exploring it and trying to complete a task.
You can see the screen and interact with it using the provided tools.

Your task is: ${input.task}
The current URL is: ${input.url}

Analyze the screenshot and decide what action to take next to accomplish the task.
Think step-by-step. What is the most logical next action?
`;

    for (let i = 0; i < 5; i++) { // Limit to 5 steps for now
        const screenshot = await playwrightService.getPageAsDataUri();

        const agentResponse = await ai.generate({
            prompt: [
                { role: 'user', content: cumulativePrompt},
                { role: 'user', content: { media: { url: screenshot } } },
            ],
            tools: [clickTool, fillInFieldTool],
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
        
        steps.push({
          action: `${action}(${JSON.stringify(actionInput) || ''})`,
          screenshot,
          observation: observation,
        });

        if (action === 'observe' || !agentResponse.toolRequest) {
            break; // Agent decided to stop
        }
        
        cumulativePrompt += `
        Step ${i + 1}:
        - Observation: ${observation}
        - Action: ${action} with input ${JSON.stringify(actionInput)}
        
        Now, analyze the new screenshot and decide the next action.
        `;
    }

    const summary = await ai.generate({
        prompt: `Based on the following steps and observations, summarize the testing session for the task: "${input.task}".\n\n` + 
                steps.map((s, i) => `Step ${i+1}: ${s.observation}\nAction: ${s.action}`).join('\n\n'),
    });


    return {
        summary: summary.text,
        steps: steps,
    };
}
