/**
 * OpenRouter Agent
 * Access to 200+ AI models through OpenRouter API
 */

import OpenAI from 'openai';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { config, logger } from '../../lib';

interface OpenRouterMessage {
  role: string;
  content: string;
}

const MODELS = {
  deepseek_free: 'tngtech/deepseek-r1t2-chimera:free',
  llama_free: 'meta-llama/llama-3.2-3b-instruct:free',
  mistral_free: 'mistralai/mistral-7b-instruct:free',
  gpt4: 'openai/gpt-4-turbo',
  claude: 'anthropic/claude-3.5-sonnet',
  deepseek_paid: 'deepseek/deepseek-chat',
  gemini: 'google/gemini-pro-1.5',
} as const;

const CURRENT_MODEL = MODELS.deepseek_free;

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: config.llm.openrouter.apiKey,
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/ordo-ai',
    'X-Title': 'Ordo AI Agent',
  },
});

/**
 * Convert LangGraph messages to OpenAI format
 */
function convertMessages(messages: any[]): OpenRouterMessage[] {
  return messages.map(msg => {
    if (typeof msg === 'string') {
      return { role: 'user', content: msg };
    }
    return {
      role: msg.role === 'ai' ? 'assistant' : msg.role,
      content: msg.content,
    };
  });
}

/**
 * Agent node - calls the model
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  try {
    const messages = convertMessages(state.messages);

    const completion = await openrouter.chat.completions.create({
      model: CURRENT_MODEL,
      messages: messages,
    });

    const response = completion.choices[0].message;

    return {
      messages: [{
        role: 'ai',
        content: response.content || '',
      }],
    };
  } catch (error) {
    logger.error('OpenRouter API error', error);
    return {
      messages: [{
        role: 'ai',
        content: `Error: ${(error as Error).message}`,
      }],
    };
  }
}

/**
 * Build and compile the workflow
 */
function buildWorkflow(): CompiledStateGraph<typeof MessagesAnnotation.State> {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addEdge(START, 'agent')
    .addEdge('agent', END);

  return workflow.compile();
}

export const app = buildWorkflow();

logger.success('OpenRouter Agent initialized');
logger.info(`Model: ${CURRENT_MODEL}`);

export default app;
