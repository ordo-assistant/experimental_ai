/**
 * Type Definitions
 * Shared TypeScript types and interfaces
 */

import type { BaseMessage } from '@langchain/core/messages';
import type { RunnableConfig } from '@langchain/core/runnables';

/**
 * Agent State
 */
export interface AgentState {
  messages: BaseMessage[];
  [key: string]: any;
}

/**
 * Agent Configuration
 */
export interface AgentConfig {
  name: string;
  description: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  userId?: string;
}

/**
 * Tool Configuration
 */
export interface ToolConfig {
  name: string;
  description: string;
  parameters?: Record<string, any>;
  required?: string[];
}

/**
 * Session Configuration
 */
export interface SessionConfig {
  userId: string;
  enabledToolkits?: string[];
  disabledToolkits?: string[];
  connectionId?: string;
}

/**
 * MCP Client Configuration
 */
export interface MCPClientConfig {
  serverUrl: string;
  apiKey?: string;
  timeout?: number;
}

/**
 * Tool Execution Result
 */
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Agent Response
 */
export interface AgentResponse {
  messages: BaseMessage[];
  toolCalls?: ToolCall[];
  metadata?: Record<string, any>;
}

/**
 * Tool Call
 */
export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
}

/**
 * Composio Session
 */
export interface ComposioSession {
  userId: string;
  tools: () => Promise<any[]>;
  toolkits: () => Promise<any[]>;
  authorize: (toolkit: string, config?: any) => Promise<any>;
  mcp: {
    url: string;
  };
}

/**
 * Web3 Configuration
 */
export interface Web3Config {
  privateKey: string;
  rpcUrl: string;
  network?: 'mainnet' | 'devnet' | 'testnet';
}

/**
 * Helius Configuration
 */
export interface HeliusConfig {
  apiKey: string;
  rpcUrl: string;
  network?: 'mainnet' | 'devnet';
}

/**
 * Search Configuration
 */
export interface SearchConfig {
  apiKey: string;
  maxResults?: number;
  includeImages?: boolean;
  includeDomains?: string[];
  excludeDomains?: string[];
}

/**
 * LLM Provider
 */
export type LLMProvider = 'cerebras' | 'openai' | 'anthropic' | 'openrouter';

/**
 * Agent Type
 */
export type AgentType = 
  | 'basic'
  | 'composio'
  | 'llm'
  | 'search'
  | 'web3'
  | 'prebuilt';

/**
 * Tool Category
 */
export type ToolCategory =
  | 'composio'
  | 'search'
  | 'web3'
  | 'defi'
  | 'nft'
  | 'token'
  | 'utility';

/**
 * MCP Server Type
 */
export type MCPServerType =
  | 'devrel'
  | 'solana'
  | 'tavily'
  | 'x402';

/**
 * Agent Factory Options
 */
export interface AgentFactoryOptions {
  type: AgentType;
  config: AgentConfig;
  tools?: any[];
  userId?: string;
}

/**
 * Tool Factory Options
 */
export interface ToolFactoryOptions {
  category: ToolCategory;
  config?: Record<string, any>;
}

/**
 * Graph Node
 */
export interface GraphNode {
  name: string;
  handler: (state: AgentState, config?: RunnableConfig) => Promise<Partial<AgentState>>;
}

/**
 * Graph Edge
 */
export interface GraphEdge {
  from: string;
  to: string;
  condition?: (state: AgentState) => boolean;
}

/**
 * Workflow Configuration
 */
export interface WorkflowConfig {
  nodes: GraphNode[];
  edges: GraphEdge[];
  entryPoint: string;
  exitPoint: string;
}

/**
 * Error Response
 */
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Success Response
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * API Response
 */
export type APIResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Pagination
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: Pagination;
}

export default {};
