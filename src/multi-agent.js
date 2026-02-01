import 'dotenv/config';
import { ChatCerebras } from '@langchain/cerebras';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

// Initialize Composio
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new LangchainProvider(),
});

console.log('🔄 Fetching tools...');
const githubTools = await composio.tools.get('default', 'GITHUB');
const gmailTools = await composio.tools.get('default', 'GMAIL');

// Create specialized agents
const githubAgent = new ChatCerebras({
  model: 'llama-3.3-70b',
  temperature: 0,
}).bindTools(githubTools);

const gmailAgent = new ChatCerebras({
  model: 'llama-3.3-70b',
  temperature: 0,
}).bindTools(gmailTools);

const supervisorAgent = new ChatCerebras({
  model: 'llama-3.3-70b',
  temperature: 0,
});

// Tool nodes for each agent
const githubToolNode = new ToolNode(githubTools);
const gmailToolNode = new ToolNode(gmailTools);

// Supervisor decides which agent to route to
async function supervisor(state) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  
  const routingPrompt = `You are a supervisor routing tasks to specialized agents.
Available agents:
- github_agent: Handles GitHub operations (repos, issues, PRs, stars)
- gmail_agent: Handles email operations (read, send, search emails)
- FINISH: Task is complete

Based on the user request, decide which agent should act next.
User request: ${lastMessage.content}

Respond with ONLY one word: github_agent, gmail_agent, or FINISH`;

  const response = await supervisorAgent.invoke([
    { role: 'user', content: routingPrompt }
  ]);
  
  const decision = response.content.toLowerCase().trim();
  console.log(`\n🎯 Supervisor decision: ${decision}`);
  
  return { next: decision };
}

// GitHub agent node
async function githubAgentNode(state) {
  console.log('🐙 GitHub agent working...');
  const response = await githubAgent.invoke(state.messages);
  return { messages: [response] };
}

// Gmail agent node
async function gmailAgentNode(state) {
  console.log('📧 Gmail agent working...');
  const response = await gmailAgent.invoke(state.messages);
  return { messages: [response] };
}

// Router function
function routeAgent(state) {
  const next = state.next || 'supervisor';
  
  if (next === 'finish') {
    return END;
  }
  
  // Check if last message has tool calls
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage.tool_calls?.length) {
    if (next === 'github_agent') return 'github_tools';
    if (next === 'gmail_agent') return 'gmail_tools';
  }
  
  return next;
}

// Build multi-agent workflow
const workflow = new StateGraph(MessagesAnnotation.extend({
  next: { value: null, default: () => 'supervisor' }
}))
  .addNode('supervisor', supervisor)
  .addNode('github_agent', githubAgentNode)
  .addNode('gmail_agent', gmailAgentNode)
  .addNode('github_tools', githubToolNode)
  .addNode('gmail_tools', gmailToolNode)
  .addEdge(START, 'supervisor')
  .addConditionalEdges('supervisor', routeAgent)
  .addEdge('github_agent', 'supervisor')
  .addEdge('gmail_agent', 'supervisor')
  .addEdge('github_tools', 'github_agent')
  .addEdge('gmail_tools', 'gmail_agent');

const app = workflow.compile();

// Export for LangGraph server
export { app };

// Run multi-agent system only if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting multi-agent system...\n');
  console.log('Example tasks:');
  console.log('- "Star the composiohq/composio repository on GitHub"');
  console.log('- "Check my latest emails"');
  console.log('- "List open issues in composiohq/composio and email me a summary"\n');

  const task = 'Star the composiohq/composio repository on GitHub';
  console.log(`📋 Task: ${task}\n`);

  try {
    const result = await app.invoke({
      messages: [new HumanMessage(task)],
    });
    
    console.log('\n✅ Final result:');
    const finalMessage = result.messages[result.messages.length - 1];
    console.log(finalMessage.content);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}
