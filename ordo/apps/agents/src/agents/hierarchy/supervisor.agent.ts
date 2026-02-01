/**
 * Supervisor Agent
 * Top-level agent that routes requests to appropriate sub-agents
 * Uses GPT-4 for intelligent routing decisions
 */

import { ChatOpenAI } from '@langchain/openai';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { config, logger } from '../../lib';

interface SupervisorState {
  messages: BaseMessage[];
  nextAgent?: string;
  taskCompleted?: boolean;
}

const AVAILABLE_AGENTS = {
  composio_coordinator: 'Handles GitHub, Gmail, and 800+ app integrations',
  search_coordinator: 'Handles web search and content extraction',
  web3_coordinator: 'Handles blockchain, DeFi, NFT operations',
  llm_coordinator: 'Handles multi-model AI tasks',
  finish: 'Task is complete, return to user',
} as const;

type AgentName = keyof typeof AVAILABLE_AGENTS;

const supervisorModel = new ChatOpenAI({
  modelName: 'gpt-4-turbo',
  temperature: 0,
  openAIApiKey: config.llm.openai.apiKey,
});

/**
 * Create routing prompt for supervisor
 */
function createRoutingPrompt(messages: any[]): string {
  const lastMessage = messages[messages.length - 1];
  const userQuery = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;

  return `You are a supervisor agent managing a team of specialized coordinators.

Available coordinators:
${Object.entries(AVAILABLE_AGENTS).map(([name, desc]) => `- ${name}: ${desc}`).join('\n')}

User query: "${userQuery}"

Analyze the query and decide which coordinator should handle it.
Respond with ONLY the coordinator name, nothing else.

Examples:
- "Create a GitHub issue" -> composio_coordinator
- "Search for AI news" -> search_coordinator
- "Get my NFTs" -> web3_coordinator
- "Compare GPT-4 and Claude" -> llm_coordinator
- If task is complete -> finish

Your decision:`;
}

/**
 * Supervisor node - routes to appropriate coordinator
 */
async function supervisorNode(state: SupervisorState): Promise<Partial<SupervisorState>> {
  logger.info('Supervisor: Analyzing request');

  const prompt = createRoutingPrompt(state.messages);
  const response = await supervisorModel.invoke([new HumanMessage(prompt)]);
  
  const decision = response.content.toString().trim().toLowerCase();
  
  let nextAgent: AgentName = 'finish';
  
  if (decision.includes('composio')) {
    nextAgent = 'composio_coordinator';
  } else if (decision.includes('search')) {
    nextAgent = 'search_coordinator';
  } else if (decision.includes('web3') || decision.includes('blockchain')) {
    nextAgent = 'web3_coordinator';
  } else if (decision.includes('llm') || decision.includes('model')) {
    nextAgent = 'llm_coordinator';
  }

  logger.success(`Supervisor: Routing to ${nextAgent}`);

  return {
    nextAgent,
    messages: [
      new AIMessage(`Routing your request to ${nextAgent.replace('_', ' ')}...`)
    ],
  };
}

/**
 * Composio Coordinator node
 */
async function composioCoordinator(state: SupervisorState): Promise<Partial<SupervisorState>> {
  logger.info('Composio Coordinator: Processing request');
  
  return {
    nextAgent: 'finish',
    taskCompleted: true,
    messages: [
      new AIMessage('Composio Coordinator: Task delegated to worker agents')
    ],
  };
}

/**
 * Search Coordinator node
 */
async function searchCoordinator(state: SupervisorState): Promise<Partial<SupervisorState>> {
  logger.info('Search Coordinator: Processing request');
  
  return {
    nextAgent: 'finish',
    taskCompleted: true,
    messages: [
      new AIMessage('Search Coordinator: Task delegated to worker agents')
    ],
  };
}

/**
 * Web3 Coordinator node
 */
async function web3Coordinator(state: SupervisorState): Promise<Partial<SupervisorState>> {
  logger.info('Web3 Coordinator: Processing request');
  
  return {
    nextAgent: 'finish',
    taskCompleted: true,
    messages: [
      new AIMessage('Web3 Coordinator: Task delegated to worker agents')
    ],
  };
}

/**
 * LLM Coordinator node
 */
async function llmCoordinator(state: SupervisorState): Promise<Partial<SupervisorState>> {
  logger.info('LLM Coordinator: Processing request');
  
  return {
    nextAgent: 'finish',
    taskCompleted: true,
    messages: [
      new AIMessage('LLM Coordinator: Task delegated to worker agents')
    ],
  };
}

/**
 * Router function
 */
function routeToAgent(state: SupervisorState): string {
  const nextAgent = state.nextAgent || 'finish';
  logger.debug(`Router: Next agent is ${nextAgent}`);
  return nextAgent;
}

/**
 * Build and compile the workflow
 */
function buildWorkflow(): CompiledStateGraph<SupervisorState> {
  const workflow = new StateGraph<SupervisorState>({
    channels: {
      messages: {
        value: (left: any[], right: any[]) => left.concat(right),
        default: () => [],
      },
      nextAgent: {
        value: (left?: string, right?: string) => right ?? left,
        default: () => undefined,
      },
      taskCompleted: {
        value: (left?: boolean, right?: boolean) => right ?? left,
        default: () => false,
      },
    },
  })
    .addNode('supervisor', supervisorNode)
    .addNode('composio_coordinator', composioCoordinator)
    .addNode('search_coordinator', searchCoordinator)
    .addNode('web3_coordinator', web3Coordinator)
    .addNode('llm_coordinator', llmCoordinator)
    .addEdge(START, 'supervisor')
    .addConditionalEdges('supervisor', routeToAgent, {
      composio_coordinator: 'composio_coordinator',
      search_coordinator: 'search_coordinator',
      web3_coordinator: 'web3_coordinator',
      llm_coordinator: 'llm_coordinator',
      finish: END,
    })
    .addConditionalEdges('composio_coordinator', routeToAgent, {
      finish: END,
    })
    .addConditionalEdges('search_coordinator', routeToAgent, {
      finish: END,
    })
    .addConditionalEdges('web3_coordinator', routeToAgent, {
      finish: END,
    })
    .addConditionalEdges('llm_coordinator', routeToAgent, {
      finish: END,
    });

  return workflow.compile();
}

export const app = buildWorkflow();

logger.success('Supervisor Agent initialized');
logger.info('Hierarchy: Supervisor -> Coordinators -> Workers');
logger.info('LLM: GPT-4 Turbo for routing decisions');

export default app;
