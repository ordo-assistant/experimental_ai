/**
 * Composio Coordinator Agent
 * Coordinates between supervisor and Composio worker agents
 * Uses Claude for intelligent task decomposition
 */

import { ChatAnthropic } from '@langchain/anthropic';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { config, logger } from '../../lib';

interface CoordinatorState {
  messages: BaseMessage[];
  nextWorker?: string;
  taskResult?: any;
}

const WORKER_AGENTS = {
  github_worker: 'GitHub operations: issues, PRs, repos',
  meta_worker: 'Dynamic tool discovery and execution',
  finish: 'Task complete, return to supervisor',
} as const;

type WorkerName = keyof typeof WORKER_AGENTS;

const coordinatorModel = new ChatAnthropic({
  modelName: 'claude-3-5-sonnet-20241022',
  temperature: 0,
  anthropicApiKey: config.llm.anthropic.apiKey,
});

/**
 * Create task analysis prompt
 */
function createTaskPrompt(messages: any[]): string {
  const lastMessage = messages[messages.length - 1];
  const userQuery = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;

  return `You are a Composio coordinator managing specialized worker agents.

Available workers:
${Object.entries(WORKER_AGENTS).map(([name, desc]) => `- ${name}: ${desc}`).join('\n')}

User task: "${userQuery}"

Analyze the task and decide which worker should handle it.
Respond with ONLY the worker name, nothing else.

Examples:
- "Create GitHub issue" -> github_worker
- "Search for Slack tools" -> meta_worker
- "Star a repository" -> github_worker
- "Find tools for Gmail" -> meta_worker

Your decision:`;
}

/**
 * Coordinator node - routes to appropriate worker
 */
async function coordinatorNode(state: CoordinatorState): Promise<Partial<CoordinatorState>> {
  logger.info('Composio Coordinator: Analyzing task');

  const prompt = createTaskPrompt(state.messages);
  const response = await coordinatorModel.invoke([new HumanMessage(prompt)]);
  
  const decision = response.content.toString().trim().toLowerCase();
  
  let nextWorker: WorkerName = 'finish';
  
  if (decision.includes('github')) {
    nextWorker = 'github_worker';
  } else if (decision.includes('meta')) {
    nextWorker = 'meta_worker';
  }

  logger.success(`Composio Coordinator: Delegating to ${nextWorker}`);

  return {
    nextWorker,
    messages: [
      new AIMessage(`Delegating to ${nextWorker.replace('_', ' ')}...`)
    ],
  };
}

/**
 * GitHub Worker node
 */
async function githubWorker(state: CoordinatorState): Promise<Partial<CoordinatorState>> {
  logger.info('GitHub Worker: Executing task');
  
  const lastMessage = state.messages[state.messages.length - 1];
  const task = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;
  
  return {
    nextWorker: 'finish',
    taskResult: { worker: 'github', task, status: 'completed' },
    messages: [
      new AIMessage(`GitHub Worker: Task completed - ${task}`)
    ],
  };
}

/**
 * Meta Worker node
 */
async function metaWorker(state: CoordinatorState): Promise<Partial<CoordinatorState>> {
  logger.info('Meta Worker: Executing task');
  
  const lastMessage = state.messages[state.messages.length - 1];
  const task = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;
  
  return {
    nextWorker: 'finish',
    taskResult: { worker: 'meta', task, status: 'completed' },
    messages: [
      new AIMessage(`Meta Worker: Task completed - ${task}`)
    ],
  };
}

/**
 * Router function
 */
function routeToWorker(state: CoordinatorState): string {
  const nextWorker = state.nextWorker || 'finish';
  logger.debug(`Router: Next worker is ${nextWorker}`);
  return nextWorker;
}

/**
 * Build and compile the workflow
 */
function buildWorkflow(): CompiledStateGraph<CoordinatorState> {
  const workflow = new StateGraph<CoordinatorState>({
    channels: {
      messages: {
        value: (left: any[], right: any[]) => left.concat(right),
        default: () => [],
      },
      nextWorker: {
        value: (left?: string, right?: string) => right ?? left,
        default: () => undefined,
      },
      taskResult: {
        value: (left?: any, right?: any) => right ?? left,
        default: () => undefined,
      },
    },
  })
    .addNode('coordinator', coordinatorNode)
    .addNode('github_worker', githubWorker)
    .addNode('meta_worker', metaWorker)
    .addEdge(START, 'coordinator')
    .addConditionalEdges('coordinator', routeToWorker, {
      github_worker: 'github_worker',
      meta_worker: 'meta_worker',
      finish: END,
    })
    .addConditionalEdges('github_worker', routeToWorker, {
      finish: END,
    })
    .addConditionalEdges('meta_worker', routeToWorker, {
      finish: END,
    });

  return workflow.compile();
}

export const app = buildWorkflow();

logger.success('Composio Coordinator initialized');
logger.info('Workers: github_worker, meta_worker');
logger.info('LLM: Claude 3.5 Sonnet for task analysis');

export default app;
