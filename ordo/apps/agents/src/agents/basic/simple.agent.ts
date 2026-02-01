/**
 * Simple Agent
 * Basic chat agent without external tools for testing
 */

import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { config, logger } from '../../lib';

// Initialize model
const model = new ChatCerebras({
  model: config.llm.cerebras.model,
  temperature: 0,
  apiKey: config.llm.cerebras.apiKey,
});

/**
 * Agent node - calls the model
 */
async function callModel(state: typeof MessagesAnnotation.State) {
  logger.debug('Simple Agent: Calling model');
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

/**
 * Build and compile the workflow
 */
function buildWorkflow(): CompiledStateGraph<typeof MessagesAnnotation.State> {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addEdge(START, 'agent')
    .addEdge('agent', END);

  return workflow.compile();
}

// Export compiled app
export const app = buildWorkflow();

// Log initialization
logger.success('Simple Agent initialized');
logger.info('Model: Cerebras Llama 3.3 70B');
logger.info('Tools: None (basic chat only)');

export default app;
