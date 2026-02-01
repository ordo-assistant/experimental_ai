/**
 * Hierarchical Agent System Types
 * Type definitions for multi-level agent hierarchy
 */

import type { BaseMessage } from '@langchain/core/messages';

/**
 * Agent Role in Hierarchy
 */
export type AgentRole = 'supervisor' | 'coordinator' | 'worker';

/**
 * Agent Topic Categories
 */
export type AgentTopic = 
  | 'composio'
  | 'search'
  | 'web3'
  | 'llm'
  | 'general';

/**
 * LLM Provider for each level
 */
export type LLMProvider = 
  | 'cerebras'
  | 'openai'
  | 'anthropic'
  | 'openrouter';

/**
 * Agent State in Hierarchy
 */
export interface HierarchyState {
  messages: BaseMessage[];
  currentAgent: string;
  agentPath: string[];
  results: Record<string, any>;
  metadata: {
    startTime: number;
    totalCost?: number;
    tokensUsed?: number;
  };
}

/**
 * Agent Configuration
 */
export interface AgentConfig {
  name: string;
  role: AgentRole;
  topic?: AgentTopic;
  llmProvider: LLMProvider;
  model: string;
  temperature: number;
  description: string;
  tools?: any[];
  subAgents?: string[];
}

/**
 * Routing Decision
 */
export interface RoutingDecision {
  nextAgent: string;
  reason: string;
  confidence: number;
}

/**
 * Task Assignment
 */
export interface TaskAssignment {
  agentName: string;
  task: string;
  priority: number;
  dependencies?: string[];
}

/**
 * Execution Result
 */
export interface ExecutionResult {
  agentName: string;
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  tokensUsed?: number;
}

/**
 * Hierarchy Level
 */
export interface HierarchyLevel {
  level: number;
  agents: AgentConfig[];
  description: string;
}

export default {};
