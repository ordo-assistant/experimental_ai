import 'dotenv/config';
import { ChatCerebras } from '@langchain/cerebras';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

// Initialize Composio with LangChain provider
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new LangchainProvider(),
});

// Fetch tools - you can specify toolkits like 'GITHUB', 'GMAIL', etc.
console.log('🔄 Fetching tools...');
const tools = await composio.tools.get('default', 'GITHUB');

// Define the tools node
const toolNode = new ToolNode(tools);

// Create a Cerebras model with tools (fast inference!)
const model = new ChatCerebras({
  model: 'llama-3.3-70b',
  temperature: 0,
}).bindTools(tools);

// Determine whether to continue or end
function shouldContinue({ messages }) {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.tool_calls?.length) {
    return 'tools';
  }
  return '__end__';
}

// Call the model
async function callModel(state) {
  console.log('🔄 Calling Cerebras model...');
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

// Build the graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode('agent', callModel)
  .addEdge('__start__', 'agent')
  .addNode('tools', toolNode)
  .addEdge('tools', 'agent')
  .addConditionalEdges('agent', shouldContinue);

// Compile the agent
const app = workflow.compile();

// Export for LangGraph server
export { app };

// Run the agent only if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting Cerebras-powered agent...\n');

  const finalState = await app.invoke({
    messages: [new HumanMessage('Star the repository composiohq/composio on GitHub')],
  });

  console.log('\n✅ Agent response:');
  console.log(finalState.messages[finalState.messages.length - 1].content);
}
