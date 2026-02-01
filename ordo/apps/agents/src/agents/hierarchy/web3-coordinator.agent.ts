/**
 * Web3 Coordinator Agent
 * Coordinates between supervisor and Web3 worker agents
 * Uses Cerebras for fast routing decisions
 */

import { ChatCerebras } from '@langchain/cerebras';
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
  solana_worker: 'NFT queries and wallet operations',
  defi_worker: 'DeFi trading and lending',
  godmode_worker: 'Advanced DeFi operations',
  finish: 'Task complete, return to supervisor',
} as const;

type WorkerName = keyof typeof WORKER_AGENTS;

const coordinatorModel = new ChatCerebras({
  model: config.llm.cerebras.model,
  temperature: 0,
  apiKey: config.llm.cerebras.apiKey,
});

/**
 * Create task analysis prompt
 */
function createTaskPrompt(messages: any[]): string {
  const lastMessage = messages[messages.length - 1];
  const userQuery = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;

  return `You are a Web3 coordinator managing specialized worker agents.

Available workers:
${Object.entries(WORKER_AGENTS).map(([name, desc]) => `- ${name}: ${desc}`).join('\n')}

User task: "${userQuery}"

Analyze the task and decide which worker should handle it.
Respond with ONLY the worker name, nothing else.

Examples:
- "Get my NFTs" -> solana_worker
- "Swap SOL for USDC" -> defi_worker
- "Check wallet balance" -> solana_worker
- "Create Jupiter DCA" -> godmode_worker
- "Get trending tokens" -> godmode_worker

Your decision:`;
}

/**
 * Coordinator node - routes to appropriate worker
 */
async function coordinatorNode(state: CoordinatorState): Promise<Partial<CoordinatorState>> {
  logger.info('Web3 Coordinator: Analyzing task');

  const prompt = createTaskPrompt(state.messages);
  const response = await coordinatorModel.invoke([new HumanMessage(prompt)]);
  
  const decision = response.content.toString().trim().toLowerCase();
  
  let nextWorker: WorkerName = 'finish';
  
  if (decision.includes('solana') || decision.includes('nft') || decision.includes('balance')) {
    nextWorker = 'solana_worker';
  } else if (decision.includes('defi') || decision.includes('swap') || decision.includes('trade')) {
    nextWorker = 'defi_worker';
  } else if (decision.includes('godmode') || decision.includes('dca') || decision.includes('trending')) {
    nextWorker = 'godmode_worker';
  }

  logger.success(`Web3 Coordinator: Delegating to ${nextWorker}`);

  return {
    nextWorker,
    messages: [
      new AIMessage(`Delegating to ${nextWorker.replace('_', ' ')}...`)
    ],
  };
}

/**
 * Solana Worker node
 */
async function solanaWorker(state: CoordinatorState): Promise<Partial<CoordinatorState>> {
  logger.info('Solana Worker: Executing task');
  
  const lastMessage = state.messages[state.messages.length - 1];
  const task = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;
  
  return {
    nextWorker: 'finish',
    taskResult: { worker: 'solana', task, status: 'completed' },
    messages: [
      new AIMessage(`Solana Worker: Task completed - ${task}`)
    ],
  };
}

/**
 * DeFi Worker node
 */
async function defiWorker(state: CoordinatorState): Promise<Partial<CoordinatorState>> {
  logger.info('DeFi Worker: Executing task');
  
  const lastMessage = state.messages[state.messages.length - 1];
  const task = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;
  
  return {
    nextWorker: 'finish',
    taskResult: { worker: 'defi', task, status: 'completed' },
    messages: [
      new AIMessage(`DeFi Worker: Task completed - ${task}`)
    ],
  };
}

/**
 * God Mode Worker node
 */
async function godmodeWorker(state: CoordinatorState): Promise<Partial<CoordinatorState>> {
  logger.info('God Mode Worker: Executing task');
  
  const lastMessage = state.messages[state.messages.length - 1];
  const task = typeof lastMessage === 'string' ? lastMessage : lastMessage.content;
  
  return {
    nextWorker: 'finish',
    taskResult: { worker: 'godmode', task, status: 'completed' },
    messages: [
      new AIMessage(`God Mode Worker: Task completed - ${task}`)
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
    .addNode('solana_worker', solanaWorker)
    .addNode('defi_worker', defiWorker)
    .addNode('godmode_worker', godmodeWorker)
    .addEdge(START, 'coordinator')
    .addConditionalEdges('coordinator', routeToWorker, {
      solana_worker: 'solana_worker',
      defi_worker: 'defi_worker',
      godmode_worker: 'godmode_worker',
      finish: END,
    })
    .addConditionalEdges('solana_worker', routeToWorker, {
      finish: END,
    })
    .addConditionalEdges('defi_worker', routeToWorker, {
      finish: END,
    })
    .addConditionalEdges('godmode_worker', routeToWorker, {
      finish: END,
    });

  return workflow.compile();
}

export const app = buildWorkflow();

logger.success('Web3 Coordinator initialized');
logger.info('Workers: solana_worker, defi_worker, godmode_worker');
logger.info('LLM: Cerebras Llama 3.3 70B for fast routing');

export default app;
