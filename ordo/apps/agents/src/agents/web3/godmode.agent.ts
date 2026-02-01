/**
 * God Mode Agent
 * Advanced Solana DeFi operations with God Mode Plugin
 * 
 * Includes 40+ tools:
 * - Birdeye: Token data and trending
 * - deBridge: Cross-chain bridging
 * - Jupiter: Trading, DCA, Limit Orders
 * - Lulo: Lending and APY
 * - Rugcheck: Token safety analysis
 * - Sanctum: LST staking
 * - Kamino: Supply APY
 * - Meteora: Token launches
 * - Crossmint: NFT checkout
 * - Polymarket: Prediction markets
 * - Wallet: Portfolio and transfers
 */

import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { SolanaAgentKit, createLangchainTools, KeypairWallet } from 'solana-agent-kit';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import GodModePlugin from '../../../../../plugin-god-mode/src/index.ts';
import { config, logger } from '../../lib';

interface GodModeToolsCache {
  tools: any[];
  model: any;
  agent: SolanaAgentKit;
}

let toolsCache: GodModeToolsCache | null = null;

/**
 * Initialize God Mode Agent with plugin
 */
async function initializeGodModeAgent(): Promise<GodModeToolsCache> {
  if (toolsCache) {
    return toolsCache;
  }

  try {
    logger.section('Initializing God Mode Agent');

    const privateKey = config.blockchain.solana.privateKey || Keypair.generate().secretKey;
    const keypair = typeof privateKey === 'string'
      ? Keypair.fromSecretKey(bs58.decode(privateKey))
      : Keypair.generate();

    const wallet = new KeypairWallet(keypair);

    const agent = new SolanaAgentKit(
      wallet,
      config.blockchain.solana.rpcUrl,
      {
        OPENAI_API_KEY: config.llm.openai.apiKey,
      }
    );

    logger.loading('Loading God Mode Plugin');
    agent.registerPlugin(GodModePlugin);

    const tools = createLangchainTools(agent);

    const model = new ChatCerebras({
      model: config.llm.cerebras.model,
      temperature: 0,
      apiKey: config.llm.cerebras.apiKey,
    }).bindTools(tools);

    toolsCache = { tools, model, agent };

    logger.success(`God Mode Agent initialized with ${tools.length} tools`);
    logger.info(`Wallet: ${wallet.publicKey.toString()}`);
    logger.info('Available categories:');
    logger.info('  - Birdeye: Token data and trending');
    logger.info('  - deBridge: Cross-chain bridging');
    logger.info('  - Jupiter: Trading, DCA, Limit Orders');
    logger.info('  - Lulo: Lending and APY');
    logger.info('  - Rugcheck: Token safety');
    logger.info('  - Sanctum: LST staking');
    logger.info('  - Kamino: Supply APY');
    logger.info('  - Meteora: Token launches');
    logger.info('  - Crossmint: NFT checkout');
    logger.info('  - Polymarket: Prediction markets');
    logger.info('  - Wallet: Portfolio and transfers');
    logger.separator();

    return toolsCache;
  } catch (error) {
    logger.failure('Failed to initialize God Mode Agent', error);
    throw error;
  }
}

/**
 * Agent node - calls the model
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  const { model } = await initializeGodModeAgent();
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

/**
 * Tool execution node
 */
async function callTools(state: typeof MessagesAnnotation.State) {
  const { tools } = await initializeGodModeAgent();
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = (lastMessage as any).tool_calls || [];

  const toolMessages = await Promise.all(
    toolCalls.map(async (toolCall: any) => {
      const foundTool = tools.find((t: any) => t.name === toolCall.name);

      if (!foundTool) {
        return {
          role: 'tool',
          content: `Tool ${toolCall.name} not found`,
          tool_call_id: toolCall.id,
        };
      }

      try {
        logger.debug(`Executing tool: ${toolCall.name}`);
        const result = await foundTool.invoke(toolCall.args);
        return {
          role: 'tool',
          content: typeof result === 'string' ? result : JSON.stringify(result),
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

logger.success('God Mode Agent ready');

export default app;
