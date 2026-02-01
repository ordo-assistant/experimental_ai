/**
 * Multi-User Agent Server Example
 * 
 * Demonstrates how to build a multi-user AI agent system with:
 * - User-specific sessions
 * - Isolated connections
 * - GitHub integration
 * - Express.js API
 * 
 * Run: node examples/multi-user-server.js
 */

import 'dotenv/config';
import express from 'express';
import { Composio } from '@composio/core';
import { 
  createGitHubAgent, 
  getUserGitHubStatus, 
  authorizeUserGitHub,
  listUserToolkits 
} from '../apps/agents/src/multi-user-github-agent.js';

const app = express();
app.use(express.json());

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// In-memory user store (replace with real database)
const users = new Map([
  ['user_001', { id: 'user_001', name: 'Alice', email: 'alice@example.com' }],
  ['user_002', { id: 'user_002', name: 'Bob', email: 'bob@example.com' }],
  ['user_003', { id: 'user_003', name: 'Charlie', email: 'charlie@example.com' }],
]);

// Simple auth middleware (replace with real authentication)
function authenticate(req, res, next) {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Missing X-User-ID header' });
  }
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
}

// Composio session middleware
async function composioSession(req, res, next) {
  if (req.user) {
    try {
      req.composioSession = await composio.create(req.user.id);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create session' });
    }
  }
  next();
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Multi-User Agent Server' });
});

// List users (for demo purposes)
app.get('/users', (req, res) => {
  res.json({
    users: Array.from(users.values()).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
    })),
  });
});

// Get current user info
app.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Get user's GitHub connection status
app.get('/github/status', authenticate, async (req, res) => {
  try {
    const status = await getUserGitHubStatus(req.user.id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect GitHub for user
app.get('/github/connect', authenticate, async (req, res) => {
  try {
    const auth = await authorizeUserGitHub(req.user.id);
    res.json({
      message: 'Visit the URL to connect GitHub',
      redirectUrl: auth.redirectUrl,
      connectionId: auth.connectionId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List user's toolkits
app.get('/toolkits', authenticate, composioSession, async (req, res) => {
  try {
    const toolkits = await listUserToolkits(req.user.id);
    res.json({ toolkits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute GitHub action for user
app.post('/github/action', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Missing message field' });
    }
    
    // Create agent for this user
    const agent = await createGitHubAgent(req.user.id);
    
    // Execute action
    const result = await agent.invoke({
      messages: [{ role: 'user', content: message }],
    });
    
    // Extract response
    const lastMessage = result.messages[result.messages.length - 1];
    
    res.json({
      userId: req.user.id,
      message: message,
      response: lastMessage.content,
      toolCalls: lastMessage.tool_calls?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Star a repository (user-specific)
app.post('/github/star', authenticate, async (req, res) => {
  try {
    const { repo } = req.body;
    
    if (!repo) {
      return res.status(400).json({ error: 'Missing repo field' });
    }
    
    const agent = await createGitHubAgent(req.user.id);
    
    const result = await agent.invoke({
      messages: [{ 
        role: 'user', 
        content: `Star the repository ${repo}` 
      }],
    });
    
    const lastMessage = result.messages[result.messages.length - 1];
    
    res.json({
      userId: req.user.id,
      repo: repo,
      response: lastMessage.content,
      success: !lastMessage.content.includes('error'),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List repositories for a GitHub user
app.get('/github/repos/:username', authenticate, async (req, res) => {
  try {
    const { username } = req.params;
    
    const agent = await createGitHubAgent(req.user.id);
    
    const result = await agent.invoke({
      messages: [{ 
        role: 'user', 
        content: `List repositories for GitHub user ${username}` 
      }],
    });
    
    const lastMessage = result.messages[result.messages.length - 1];
    
    res.json({
      userId: req.user.id,
      username: username,
      response: lastMessage.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get repository issues
app.get('/github/issues/:owner/:repo', authenticate, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    const agent = await createGitHubAgent(req.user.id);
    
    const result = await agent.invoke({
      messages: [{ 
        role: 'user', 
        content: `List issues for repository ${owner}/${repo}` 
      }],
    });
    
    const lastMessage = result.messages[result.messages.length - 1];
    
    res.json({
      userId: req.user.id,
      repository: `${owner}/${repo}`,
      response: lastMessage.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test multi-user isolation
app.get('/test/isolation', async (req, res) => {
  try {
    const results = [];
    
    for (const [userId, user] of users) {
      const status = await getUserGitHubStatus(userId);
      const toolkits = await listUserToolkits(userId);
      
      results.push({
        userId,
        name: user.name,
        githubConnected: status.connected,
        toolkitsCount: toolkits.length,
        connectedToolkits: toolkits.filter(t => t.connected).length,
      });
    }
    
    res.json({
      message: 'Multi-user isolation test',
      users: results,
      isolated: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Multi-User Agent Server started');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log('');
  console.log('📚 Available endpoints:');
  console.log('  GET  /health              - Health check');
  console.log('  GET  /users               - List demo users');
  console.log('  GET  /me                  - Get current user (requires X-User-ID header)');
  console.log('  GET  /github/status       - GitHub connection status');
  console.log('  GET  /github/connect      - Connect GitHub');
  console.log('  GET  /toolkits            - List user toolkits');
  console.log('  POST /github/action       - Execute GitHub action');
  console.log('  POST /github/star         - Star a repository');
  console.log('  GET  /github/repos/:user  - List user repositories');
  console.log('  GET  /github/issues/:o/:r - List repository issues');
  console.log('  GET  /test/isolation      - Test multi-user isolation');
  console.log('');
  console.log('🔑 Demo users:');
  users.forEach(user => {
    console.log(`  - ${user.name} (${user.id})`);
  });
  console.log('');
  console.log('💡 Example requests:');
  console.log('  curl -H "X-User-ID: user_001" http://localhost:3000/me');
  console.log('  curl -H "X-User-ID: user_001" http://localhost:3000/github/status');
  console.log('  curl -H "X-User-ID: user_001" -H "Content-Type: application/json" \\');
  console.log('       -d \'{"repo": "composiohq/composio"}\' \\');
  console.log('       http://localhost:3000/github/star');
});
