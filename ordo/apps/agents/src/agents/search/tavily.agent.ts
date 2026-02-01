/**
 * Tavily Agent
 * Web search and content extraction using Tavily API
 */

import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';
import { config, logger } from '../../lib';

interface TavilySearchParams {
  query: string;
  searchDepth?: 'basic' | 'advanced';
  maxResults?: number;
}

interface TavilyExtractParams {
  urls: string[];
}

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
}

interface TavilySearchResponse {
  results?: TavilySearchResult[];
  answer?: string;
}

interface TavilyExtractResult {
  url: string;
  raw_content: string;
}

interface TavilyExtractResponse {
  results?: TavilyExtractResult[];
}

/**
 * Tavily Search Tool
 */
const tavilySearch = tool(
  async ({ query, searchDepth = 'basic', maxResults = 5 }: TavilySearchParams) => {
    try {
      const response = await axios.post<TavilySearchResponse>(
        'https://api.tavily.com/search',
        {
          api_key: config.search.tavily.apiKey,
          query,
          search_depth: searchDepth,
          max_results: maxResults,
          include_answer: true,
          include_images: false,
        }
      );

      const results = response.data.results || [];
      const answer = response.data.answer || '';

      let output = answer ? `Answer: ${answer}\n\nSources:\n` : 'Search Results:\n';
      
      results.forEach((result, i) => {
        output += `${i + 1}. ${result.title}\n`;
        output += `   ${result.url}\n`;
        output += `   ${result.content}\n\n`;
      });

      return output;
    } catch (error) {
      logger.error('Tavily search error', error);
      return `Error searching: ${(error as Error).message}`;
    }
  },
  {
    name: 'tavily_search',
    description: 'Search the web using Tavily API. Returns relevant results with content and sources.',
    schema: z.object({
      query: z.string().describe('The search query'),
      searchDepth: z.enum(['basic', 'advanced']).optional().describe('Search depth'),
      maxResults: z.number().optional().describe('Maximum number of results'),
    }),
  }
);

/**
 * Tavily Extract Tool
 */
const tavilyExtract = tool(
  async ({ urls }: TavilyExtractParams) => {
    try {
      const response = await axios.post<TavilyExtractResponse>(
        'https://api.tavily.com/extract',
        {
          api_key: config.search.tavily.apiKey,
          urls,
        }
      );

      const results = response.data.results || [];
      let output = 'Extracted Content:\n\n';

      results.forEach((result, i) => {
        output += `${i + 1}. ${result.url}\n`;
        output += `${result.raw_content}\n\n`;
      });

      return output;
    } catch (error) {
      logger.error('Tavily extract error', error);
      return `Error extracting: ${(error as Error).message}`;
    }
  },
  {
    name: 'tavily_extract',
    description: 'Extract clean content from specific URLs using Tavily API.',
    schema: z.object({
      urls: z.array(z.string()).describe('Array of URLs to extract content from'),
    }),
  }
);

const tools = [tavilySearch, tavilyExtract];

const model = new ChatCerebras({
  model: config.llm.cerebras.model,
  temperature: 0,
  apiKey: config.llm.cerebras.apiKey,
}).bindTools(tools);

/**
 * Agent node - calls the model
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

/**
 * Tool execution node
 */
async function callTools(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = (lastMessage as any).tool_calls || [];

  const toolMessages = await Promise.all(
    toolCalls.map(async (toolCall: any) => {
      const foundTool = tools.find(t => t.name === toolCall.name);
      
      if (!foundTool) {
        return {
          role: 'tool',
          content: `Tool ${toolCall.name} not found`,
          tool_call_id: toolCall.id,
        };
      }

      try {
        const result = await foundTool.invoke(toolCall.args);
        return {
          role: 'tool',
          content: result,
          tool_call_id: toolCall.id,
        };
      } catch (error) {
        logger.error(`Tool execution error: ${toolCall.name}`, error);
        return {
          role: 'tool',
          content: `Error: ${(error as Error).message}`,
          tool_call_id: toolCall.id,
        };
      }
    })
  );

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

logger.success('Tavily Agent initialized');
logger.info('Tools: tavily_search, tavily_extract');

export default app;
