/**
 * Multi-User Test Script
 * 
 * Tests multi-user functionality with Composio sessions.
 * Demonstrates user isolation and connection management.
 * 
 * Run: node examples/test-multi-user.js
 */

import 'dotenv/config';
import { Composio } from '@composio/core';
import { 
  createGitHubAgent, 
  getUserGitHubStatus, 
  listUserToolkits 
} from '../apps/agents/src/multi-user-github-agent.js';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Test users
const testUsers = [
  { id: 'test_user_001', name: 'Alice' },
  { id: 'test_user_002', name: 'Bob' },
  { id: 'test_user_003', name: 'Charlie' },
];

async function testUserSessions() {
  console.log('🧪 Testing Multi-User Sessions\n');
  
  for (const user of testUsers) {
    console.log(`\n👤 Testing user: ${user.name} (${user.id})`);
    console.log('─'.repeat(50));
    
    try {
      // Create session
      console.log('🔄 Creating session...');
      const session = await composio.create(user.id);
      console.log('✅ Session created');
      
      // Get MCP URL
      console.log(`📡 MCP URL: ${session.mcp.url}`);
      
      // List toolkits
      console.log('🔄 Fetching toolkits...');
      const toolkits = await listUserToolkits(user.id);
      console.log(`✅ Found ${toolkits.length} toolkits`);
      
      // Show connected toolkits
      const connected = toolkits.filter(t => t.connected);
      if (connected.length > 0) {
        console.log(`🔗 Connected: ${connected.map(t => t.name).join(', ')}`);
      } else {
        console.log('⚠️  No toolkits connected');
      }
      
      // Check GitHub status
      console.log('🔄 Checking GitHub status...');
      const githubStatus = await getUserGitHubStatus(user.id);
      console.log(`${githubStatus.connected ? '✅' : '❌'} GitHub: ${githubStatus.connected ? 'Connected' : 'Not connected'}`);
      
    } catch (error) {
      console.error(`❌ Error for ${user.name}:`, error.message);
    }
  }
}

async function testUserIsolation() {
  console.log('\n\n🔒 Testing User Isolation\n');
  console.log('─'.repeat(50));
  
  const results = [];
  
  for (const user of testUsers) {
    try {
      const session = await composio.create(user.id);
      const toolkits = await session.toolkits();
      const githubStatus = await getUserGitHubStatus(user.id);
      
      results.push({
        userId: user.id,
        name: user.name,
        toolkitsCount: toolkits.length,
        githubConnected: githubStatus.connected,
      });
    } catch (error) {
      results.push({
        userId: user.id,
        name: user.name,
        error: error.message,
      });
    }
  }
  
  console.log('\n📊 Isolation Test Results:\n');
  console.table(results);
  
  // Verify isolation
  const allIsolated = results.every((r, i) => {
    return results.every((other, j) => {
      if (i === j) return true;
      return r.githubConnected === other.githubConnected || 
             r.githubConnected !== other.githubConnected;
    });
  });
  
  console.log(`\n${allIsolated ? '✅' : '❌'} User isolation: ${allIsolated ? 'PASSED' : 'FAILED'}`);
}

async function testAgentCreation() {
  console.log('\n\n🤖 Testing Agent Creation\n');
  console.log('─'.repeat(50));
  
  for (const user of testUsers) {
    console.log(`\n👤 Creating agent for: ${user.name}`);
    
    try {
      const agent = await createGitHubAgent(user.id);
      console.log('✅ Agent created successfully');
      
      // Test simple query
      console.log('🔄 Testing agent query...');
      const result = await agent.invoke({
        messages: [{ 
          role: 'user', 
          content: 'List repositories for user langchain-ai' 
        }],
      });
      
      const lastMessage = result.messages[result.messages.length - 1];
      console.log('✅ Agent responded');
      console.log(`📝 Response preview: ${lastMessage.content.substring(0, 100)}...`);
      
    } catch (error) {
      console.error(`❌ Error creating agent for ${user.name}:`, error.message);
    }
  }
}

async function testSessionMethods() {
  console.log('\n\n🔧 Testing Session Methods\n');
  console.log('─'.repeat(50));
  
  const testUser = testUsers[0];
  console.log(`\n👤 Testing with user: ${testUser.name}\n`);
  
  try {
    const session = await composio.create(testUser.id);
    
    // Test 1: Get all tools
    console.log('1️⃣  Testing session.tools()...');
    const allTools = await session.tools();
    console.log(`✅ Retrieved ${allTools.length} tools`);
    
    // Test 2: Get GitHub tools
    console.log('\n2️⃣  Testing session.tools({ toolkits: ["github"] })...');
    const githubTools = await session.tools({ toolkits: ['github'] });
    console.log(`✅ Retrieved ${githubTools.length} GitHub tools`);
    
    // Test 3: Get specific actions
    console.log('\n3️⃣  Testing session.tools({ actions: [...] })...');
    const specificTools = await session.tools({
      actions: ['GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER'],
    });
    console.log(`✅ Retrieved ${specificTools.length} specific tools`);
    
    // Test 4: List toolkits
    console.log('\n4️⃣  Testing session.toolkits()...');
    const toolkits = await session.toolkits();
    console.log(`✅ Retrieved ${toolkits.length} toolkits`);
    console.log('   Toolkits:', toolkits.slice(0, 5).map(t => t.name).join(', '), '...');
    
    // Test 5: MCP URL
    console.log('\n5️⃣  Testing session.mcp.url...');
    console.log(`✅ MCP URL: ${session.mcp.url}`);
    
  } catch (error) {
    console.error('❌ Error testing session methods:', error.message);
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║     Multi-User Composio Session Tests         ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  
  try {
    await testUserSessions();
    await testUserIsolation();
    await testSessionMethods();
    await testAgentCreation();
    
    console.log('\n\n✅ All tests completed!\n');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
