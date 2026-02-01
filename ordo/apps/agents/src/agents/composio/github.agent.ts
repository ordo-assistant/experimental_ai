/**
 * GitHub Agent
 * Composio-powered agent for GitHub operations
 */

import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { config, logger } from '../../lib';

interface GitHubToolsCache {
  tools: any[];
  toolNode: ToolNode;
  model: any;
}

let toolsCache: GitHubToolsCache | null = null;

const GITHUB_ACTIONS = [
  'GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER',
  'GITHUB_LIST_REPOSITORIES_FOR_A_USER',
  'GITHUB_GET_A_REPOSITORY',
  'GITHUB_LIST_REPOSITORY_ISSUES',
] as const;

/**
 * Initialize GitHub tools from Composio
 */
async function initializeTools(): Promise<GitHubToolsCache> {
  if (toolsCache) {
    return toolsCache;
  }

  try {
    logger.info('Initializing GitHub Agent');

    const composio = new Composio({
      apiKey: config.composio.apiKey,
      provider: new LangchainProvider(),
    });

    const tools = await composio.tools.get('default', GITHUB_ACTIONS);
    const toolNode = new ToolNode(tools);

    const model = new ChatCerebras({
      model: config.llm.cerebras.model,
      temperature: 0,
      apiKey: config.llm.cerebras.apiKey,
    }).bindTools(tools);

    toolsCache = { tools, toolNode, model };

    logger.success('GitHub Agent initialized');
    logger.info(`Loaded ${tools.length} GitHub tools`);

    return toolsCache;
  } catch (error) {
    logger.failure('Failed to initialize GitHub Agent', error);
    throw error;
  }
}

/**
 * Agent node - calls the model
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  const { model } = await initializeTools();
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

/**
 * Tool execution node
 */
async function callTools(state: typeof MessagesAnnotation.State) {
  const { toolNode } = await initializeTools();
  return await toolNode.invoke(state);
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

logger.success('GitHub Agent ready');

export default app;
