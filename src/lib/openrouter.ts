
'use server';

type Message = {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | any[];
};

type CallOpenRouterParams = {
    model: string;
    messages: Message[];
    tools?: any[];
    tool_choice?: string;
};

// A helper function to call the OpenRouter API
async function callOpenRouterApi(params: CallOpenRouterParams) {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
        throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
    }

    const body = {
        model: params.model,
        messages: params.messages,
        ...(params.tools && { tools: params.tools }),
        ...(params.tool_choice && { tool_choice: params.tool_choice }),
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterApiKey}`,
            'HTTP-Referer': 'https://example.com', // Required by some models
            'X-Title': 'Firebase Studio AutoPilot',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenRouter API request failed with status ${response.status}: ${errorBody}`);
    }

    return response.json();
}


/**
 * Calls the OpenRouter API and returns the raw text response.
 */
export async function callOpenRouter(params: CallOpen-RouterParams): Promise<string> {
    const responseData = await callOpenRouterApi(params);
    return responseData.choices[0].message.content;
}

/**
 * Calls the OpenRouter API and returns the first tool call from the response.
 */
export async function callOpenRouterWithTools(params: CallOpenRouterParams): Promise<any> {
    const responseData = await callOpenRouterApi(params);
    return responseData.choices[0].message.tool_calls[0];
}


/**
 * Calls the OpenRouter API, expects a JSON response, and parses it.
 * It will automatically retry if the JSON is invalid.
 * @param params The parameters for the OpenRouter call.
 * @param retries The number of times to retry on parsing failure.
 * @returns The parsed JSON object of type T.
 */
export async function callOpenRouterWithJson<T>(params: CallOpenRouterParams, retries = 2): Promise<T> {
    let lastError: any = null;

    for (let i = 0; i < retries; i++) {
        try {
            const responseData = await callOpenRouterApi({ ...params, response_format: { type: 'json_object' } });
            const content = responseData.choices[0].message.content;
            
            // Clean the response by removing markdown backticks if they exist
            const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(cleanedContent) as T;
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${i + 1} failed. Retrying...`, error);
        }
    }
    
    throw new Error(`Failed to get valid JSON from OpenRouter after ${retries} attempts. Last error: ${lastError.message}`);
}
