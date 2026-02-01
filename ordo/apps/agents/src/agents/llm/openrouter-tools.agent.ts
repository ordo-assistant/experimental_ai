/**
 * OpenRouter Tools Agent
 * OpenRouter with tool calling support
 */

import OpenAI from 'openai';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { config, logger } from '../../lib';

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface CalculatorArgs {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  a: number;
  b: number;
}

const MODEL = 'openai/gpt-4-turbo';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: config.llm.openrouter.apiKey,
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/ordo-ai',
    'X-Title': 'Ordo AI Agent',
  },
});

const tools = [
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Perform basic arithmetic operations',
      parameters: {
        type: 'object',
        properties: {
          operation: {
            type: 'string',
            enum: ['add', 'subtract', 'multiply', 'divide'],
            description: 'The arithmetic operation to perform',
          },
          a: {
            type: 'number',
            description: 'First number',
          },
          b: {
            type: 'number',
            description: 'Second number',
          },
        },
        required: ['operation', 'a', 'b'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_time',
      description: 'Get the current time',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

/**
 * Execute calculator tool
 */
function executeCalculator(args: CalculatorArgs): number | string {
  const { operation, a, b } = args;
  
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      return b !== 0 ? a / b : 'Error: Division by zero';
    default:
      return 'Unknown operation';
  }
}

/**
 * Execute get_time tool
 */
function executeGetTime(): string {
  return new Date().toLocaleString();
}

/**
 * Execute tool by name
 */
function executeTool(toolCall: ToolCall): string {
  const { name, arguments: argsStr } = toolCall.function;
  
  try {
    if (name === 'calculator') {
      const args = JSON.parse(argsStr) as CalculatorArgs;
      const result = executeCalculator(args);
      return String(result);
    }
    
    if (name === 'get_time') {
      return executeGetTime();
    }
    
    return 'Unknown tool';
  } catch (error) {
    logger.error(`Tool execution error: ${name}`, error);
    return `Error: ${(error as Error).message}`;
  }
}

/**
 * Convert messages to OpenAI format
 */
function convertMessages(messages: any[]): any[] {
  return messages.map(msg => {
    if (typeof msg === 'string') {
      return { role: 'user', content: msg };
    }
    
    if (msg.role === 'tool') {
      return {
        role: 'tool',
        content: msg.content,
        tool_call_id: msg.tool_call_id,
      };
    }
    
    return {
      role: msg.role === 'ai' ? 'assistant' : msg.role,
      content: msg.content,
      tool_calls: msg.tool_calls,
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
      model: MODEL,
      messages: messages,
      tools: tools as any,
    });

    const response = completion.choices[0].message;

    return {
      messages: [{
        role: 'ai',
        content: response.content || '',
        tool_calls: response.tool_calls || [],
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
 * Tool execution node
 */
async function callTools(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = (lastMessage as any).tool_calls || [];

  const toolMessages = toolCalls.map((toolCall: ToolCall) => {
    const result = executeTool(toolCall);
    
    return {
      role: 'tool',
      content: result,
      tool_call_id: toolCall.id,
    };
  });

  return { messages: toolMessages };
}

/**
 * Router - decides next step
 */
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1];
  if ((lastMessage as any).tool_calls?.length) {
    return 'tools';
  }
  return END;
}

/**
 * Build and compile the workflow
 */
function buildWorkflow(): CompiledStateGraph<typeof MessagesAnnotation.State> {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addNode('tools', callTools)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', shouldContinue, {
      tools: 'tools',
      [END]: END,
    })
    .addEdge('tools', 'agent');

  return workflow.compile();
}

export const app = buildWorkflow();

logger.success('OpenRouter Tools Agent initialized');
logger.info(`Model: ${MODEL}`);

export default app;
