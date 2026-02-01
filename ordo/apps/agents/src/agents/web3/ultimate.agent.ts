/**
 * Ultimate Agent
 * The most comprehensive Solana AI agent combining all plugins
 * 
 * Includes 150+ tools from:
 * - DeFi Plugin: 50+ tools (Trading, lending, perpetuals, AMMs)
 * - NFT Plugin: 15+ tools (Metaplex, Tensor, Magic Eden, 3Land)
 * - Token Plugin: 30+ tools (Jupiter, Pumpfun, Pyth, Rugcheck)
 * - Blinks Plugin: Solana Actions and Blinks
 * - Misc Plugin: Utility functions
 * - God Mode Plugin: 40+ advanced DeFi tools
 */

import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { SolanaAgentKit, createLangchainTools, KeypairWallet } from 'solana-agent-kit';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import DefiPlugin from '../../../../../solana-agent-kit/packages/plugin-defi/src/index.ts';
import NFTPlugin from '../../../../../solana-agent-kit/packages/plugin-nft/src/index.ts';
import TokenPlugin from '../../../../../solana-agent-kit/packages/plugin-token/src/index.ts';
import BlinksPlugin from '../../../../../solana-agent-kit/packages/plugin-blinks/src/index.ts';
import MiscPlugin from '../../../../../solana-agent-kit/packages/plugin-misc/src/index.ts';
import GodModePlugin from '../../../../../plugin-god-mode/src/index.ts';
import { config, logger } from '../../lib';

interface UltimateToolsCache {
  tools: any[];
  model: any;
  agent: SolanaAgentKit;
}

let toolsCache: UltimateToolsCache | null = null;

/**
 * Initialize Ultimate Agent with all plugins
 */
async function initializeUltimateAgent(): Promise<UltimateToolsCache> {
  if (toolsCache) {
    return toolsCache;
  }

  try {
    logger.section('Initializing Ultimate Agent');

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

    logger.loading('Loading all plugins');

    logger.info('1. DeFi Plugin');
    agent.registerPlugin(DefiPlugin);
    logger.success('   Loaded: Adrena, Flash, Lulo, Manifest, Meteora, Openbook, Orca, Raydium, Pumpfun, Solayer, Voltr, Drift, deBridge, Fluxbeam, Sanctum, OKX');

    logger.info('2. NFT Plugin');
    agent.registerPlugin(NFTPlugin);
    logger.success('   Loaded: Metaplex, Tensor, 3Land, Magic Eden');

    logger.info('3. Token Plugin');
    agent.registerPlugin(TokenPlugin);
    logger.success('   Loaded: Jupiter, Pumpfun, Pyth, Rugcheck, Dexscreener, Light Protocol, Mayan, Solutiofi');

    logger.info('4. Blinks Plugin');
    agent.registerPlugin(BlinksPlugin);
    logger.success('   Loaded: Solana Actions and Blinks');

    logger.info('5. Misc Plugin');
    agent.registerPlugin(MiscPlugin);
    logger.success('   Loaded: Utility functions');

    logger.info('6. God Mode Plugin');
    agent.registerPlugin(GodModePlugin);
    logger.success('   Loaded: Birdeye, deBridge, Jupiter DCA/LO, Lulo, Rugcheck, Sanctum, Kamino, Meteora, Crossmint, Polymarket, Wallet tools');

    const tools = createLangchainTools(agent);

    const model = new ChatCerebras({
      model: config.llm.cerebras.model,
      temperature: 0,
      apiKey: config.llm.cerebras.apiKey,
    }).bindTools(tools);

    toolsCache = { tools, model, agent };

    logger.separator();
    logger.complete('Ultimate Agent Ready');
    logger.info(`Total tools loaded: ${tools.length}`);
    logger.info(`Wallet: ${wallet.publicKey.toString()}`);
    logger.separator();

    logger.info('Available categories:');
    logger.info('  - DeFi Trading: Jupiter, Raydium, Orca, Meteora');
    logger.info('  - Perpetuals: Drift, Adrena, Flash');
    logger.info('  - Lending: Lulo, Kamino, Drift');
    logger.info('  - NFTs: Metaplex, Tensor, Magic Eden, 3Land');
    logger.info('  - Token Launch: Pumpfun, Meteora');
    logger.info('  - Market Data: Birdeye, Pyth, Dexscreener');
    logger.info('  - Safety: Rugcheck');
    logger.info('  - Staking: Sanctum, Solayer');
    logger.info('  - Cross-Chain: deBridge, Mayan');
    logger.info('  - Prediction: Polymarket');
    logger.info('  - Portfolio: Wallet management');
    logger.info('  - Advanced: DCA, Limit Orders, Vaults');
    logger.separator();

    return toolsCache;
  } catch (error) {
    logger.failure('Failed to initialize Ultimate Agent', error);
    throw error;
  }
}

/**
 * Agent node - calls the model
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  const { model } = await initializeUltimateAgent();
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

/**
 * Tool execution node
 */
async function callTools(state: typeof MessagesAnnotation.State) {
  const { tools } = await initializeUltimateAgent();
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

logger.success('Ultimate Agent ready');
logger.info('150+ tools from 6 plugins loaded');

export default app;
