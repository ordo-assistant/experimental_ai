/**
 * Solana Agent
 * NFT queries and wallet operations using Helius SDK
 */

import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createHelius } from 'helius-sdk';
import { config, logger } from '../../lib';

interface GetNFTsParams {
  ownerAddress: string;
  page?: number;
  limit?: number;
}

interface GetAssetParams {
  assetId: string;
}

interface GetBalanceParams {
  address: string;
}

const helius = createHelius({ apiKey: config.blockchain.helius.apiKey });

/**
 * Get NFTs by Owner Tool
 */
const getNFTsByOwner = tool(
  async ({ ownerAddress, page = 1, limit = 10 }: GetNFTsParams) => {
    try {
      const assets = await helius.getAssetsByOwner({
        ownerAddress,
        page,
        limit,
        sortBy: { sortBy: 'created', sortDirection: 'desc' },
      });

      if (!assets || assets.items.length === 0) {
        return `No NFTs found for address: ${ownerAddress}`;
      }

      let output = `Found ${assets.total} NFTs for ${ownerAddress}\n\n`;
      
      assets.items.forEach((asset: any, i: number) => {
        output += `${i + 1}. ${asset.content?.metadata?.name || 'Unnamed NFT'}\n`;
        output += `   Collection: ${asset.grouping?.[0]?.group_value || 'N/A'}\n`;
        output += `   Mint: ${asset.id}\n\n`;
      });

      return output;
    } catch (error) {
      logger.error('Get NFTs error', error);
      return `Error fetching NFTs: ${(error as Error).message}`;
    }
  },
  {
    name: 'get_nfts_by_owner',
    description: 'Get NFTs owned by a Solana wallet address',
    schema: z.object({
      ownerAddress: z.string().describe('Solana wallet address'),
      page: z.number().optional().describe('Page number'),
      limit: z.number().optional().describe('Results per page'),
    }),
  }
);

/**
 * Get Asset by ID Tool
 */
const getAssetById = tool(
  async ({ assetId }: GetAssetParams) => {
    try {
      const asset = await helius.getAsset({ id: assetId });

      if (!asset) {
        return `Asset not found: ${assetId}`;
      }

      const metadata = asset.content?.metadata || {};
      let output = 'NFT Details:\n';
      output += `Name: ${metadata.name || 'N/A'}\n`;
      output += `Symbol: ${metadata.symbol || 'N/A'}\n`;
      output += `Description: ${metadata.description || 'N/A'}\n`;
      output += `Mint Address: ${asset.id}\n`;
      output += `Owner: ${asset.ownership?.owner || 'N/A'}\n`;

      if (asset.grouping && asset.grouping.length > 0) {
        output += `Collection: ${asset.grouping[0].group_value}\n`;
      }

      if (metadata.attributes && metadata.attributes.length > 0) {
        output += '\nAttributes:\n';
        metadata.attributes.forEach((attr: any) => {
          output += `  - ${attr.trait_type}: ${attr.value}\n`;
        });
      }

      return output;
    } catch (error) {
      logger.error('Get asset error', error);
      return `Error fetching asset: ${(error as Error).message}`;
    }
  },
  {
    name: 'get_asset_by_id',
    description: 'Get detailed information about a specific NFT by its mint address',
    schema: z.object({
      assetId: z.string().describe('NFT mint address'),
    }),
  }
);

/**
 * Get Wallet Balance Tool
 */
const getBalance = tool(
  async ({ address }: GetBalanceParams) => {
    try {
      const response = await helius.rpc.getBalance(address);
      const solBalance = response / 1e9;
      return `Wallet ${address} has ${solBalance.toFixed(4)} SOL`;
    } catch (error) {
      logger.error('Get balance error', error);
      return `Error fetching balance: ${(error as Error).message}`;
    }
  },
  {
    name: 'get_balance',
    description: 'Get SOL balance of a Solana wallet address',
    schema: z.object({
      address: z.string().describe('Solana wallet address'),
    }),
  }
);

const tools = [getNFTsByOwner, getAssetById, getBalance];

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

logger.success('Solana Agent initialized');
logger.info('Tools: get_nfts_by_owner, get_asset_by_id, get_balance');

export default app;
