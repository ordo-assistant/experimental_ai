/**
 * Composio Meta Agent
 * Dynamic access to 800+ toolkits using Meta Tools
 * 
 * Meta Tools:
 * 1. COMPOSIO_SEARCH_TOOLS - Discover tools
 * 2. COMPOSIO_MANAGE_CONNECTIONS - Handle auth
 * 3. COMPOSIO_MULTI_EXECUTE_TOOL - Execute tools
 * 4. COMPOSIO_REMOTE_WORKBENCH - Python sandbox
 * 5. COMPOSIO_REMOTE_BASH_TOOL - Bash commands
 */

import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { config, logger } from '../../lib';
import type { ComposioSession } from '../../lib/types';

// Cache for initialized tools
let toolsCache: any[] | null = null;
let toolNodeCache: ToolNode | null = null;
let modelCache: any | null = null;
let sessionCache: ComposioSession | null = null;

/**
 * Initialize Composio Meta Tools
 */
async function initializeMetaTools(userId: string = 'default') {
  if (toolsCache && toolNodeCache && modelCache && sessionCache) {
    return { tools: toolsCache, toolNode: toolNodeCache, model: modelCache, session: sessionCache };
  }

  try {
    logger.section('🎯 Initializing Composio Meta Agent');
    
    // Initialize Composio
    const composio = new Composio({
      apiKey: config.composio.apiKey,
      provider: new LangchainProvider(),
    });

    // Create session for user
    logger.info(`👤 Creating session for user: ${userId}`);
    const session = await composio.create(userId) as ComposioSession;
    sessionCache = session;

    // Get Meta Tools from session
    logger.loading('🔍 Loading Meta Tools...');
    const tools = await session.tools();
    toolsCache = tools;

    logger.success('Meta Tools loaded:');
    logger.info('   1️⃣  COMPOSIO_SEARCH_TOOLS - Discover 800+ tools');
    logger.info('   2️⃣  COMPOSIO_MANAGE_CONNECTIONS - Handle auth');
    logger.info('   3️⃣  COMPOSIO_MULTI_EXECUTE_TOOL - Execute tools');
    logger.info('   4️⃣  COMPOSIO_REMOTE_WORKBENCH - Python sandbox');
    logger.info('   5️⃣  COMPOSIO_REMOTE_BASH_TOOL - Bash commands');

    logger.info('\n🌐 Available Toolkits: 800+');
    logger.info('   • GitHub, Gmail, Slack, Linear, Notion');
    logger.info('   • Google Drive, Calendar, Sheets, Docs');
    logger.info('   • Jira, Asana, Trello, Monday');
    logger.info('   • Salesforce, HubSpot, Zendesk');
    logger.info('   • Twitter, Discord, Telegram');
    logger.info('   • And 795+ more!');

    // Create tool node
    const toolNode = new ToolNode(tools);
    toolNodeCache = toolNode;

    // Create model with tools
    const model = new ChatCerebras({
      model: config.llm.cerebras.model,
      temperature: 0,
      apiKey: config.llm.cerebras.apiKey,
    }).bindTools(tools);
    modelCache = model;

    logger.separator();
    logger.complete(`Meta Agent ready with ${tools.length} meta tools`);
    logger.separator();

    return { tools, toolNode, model, session };
  } catch (error) {
    logger.failure('Failed to initialize Meta Agent', error);
    throw error;
  }
}

/**
 * Agent node - calls the model
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  const { model } = await initializeMetaTools();
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

/**
 * Tool execution node
 */
async function callTools(state: typeof MessagesAnnotation.State) {
  const { toolNode } = await initializeMetaTools();
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

// Export compiled app
export const app = buildWorkflow();

// Log initialization
logger.success('🎯 Composio Meta Agent initialized!');
logger.info('🌐 Dynamic access to 800+ toolkits ready!');
logger.info('');
logger.info('💡 Example queries:');
logger.info('   "Search for tools to create GitHub issues"');
logger.info('   "Find tools for sending emails"');
logger.info('   "What tools can I use for Slack?"');
logger.info('   "Create a GitHub issue for bug XYZ"');
logger.info('   "Send an email via Gmail"');
logger.info('   "Post a message to Slack"');

export default app;
