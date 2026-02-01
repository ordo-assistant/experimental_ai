# Multi-User Setup Guide for Ordo

## Overview

When building AI agents for multiple users, Composio provides **users** and **sessions** to manage isolated connections and context for each user.

## Key Concepts

### Users
A **user** is an identifier from your app. Each user has:
- Isolated connections (Gmail, GitHub, etc.)
- Separate authentication context
- Independent tool execution environment

### Sessions
A **session** is an ephemeral configuration that specifies:
- Which user's authorization to use
- What toolkits are enabled/disabled
- Authentication method, scopes, and credentials

## Current Setup (Single User)

Your current agents use the **default user**:

```javascript
// Current approach in composio-github-agent.js
const tools = await composio.tools.get('default', [
  'GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER',
  // ...
]);
```

⚠️ **Warning:** Using `'default'` in production exposes other users' data!

## Upgrading to Multi-User

### Step 1: Create User-Specific Sessions

**Python:**
```python
from composio import Composio

composio = Composio(api_key="your_api_key")

# Create session for specific user
session = composio.create(user_id="user_123")

# Get tools for this user
tools = session.tools()

# Authorize user to GitHub
connection_request = session.authorize("github")
```

**TypeScript:**
```typescript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Create session for specific user
const session = await composio.create("user_123");

// Get tools for this user
const tools = await session.tools();

// Authorize user to GitHub
const connectionRequest = await session.authorize("github");
```

### Step 2: Update Your Agents

Here's how to modify your agents for multi-user support:

#### Example: Multi-User GitHub Agent

```javascript
import 'dotenv/config';
import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';
import { ToolNode } from '@langchain/langgraph/prebuilt';

// Initialize Composio
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new LangchainProvider(),
});

// Create agent factory for specific user
export async function createGitHubAgent(userId) {
  // Create user-specific session
  const session = await composio.create(userId);
  
  // Get tools for this user
  const tools = await session.tools({
    actions: [
      'GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER',
      'GITHUB_LIST_REPOSITORIES_FOR_A_USER',
      'GITHUB_GET_A_REPOSITORY',
      'GITHUB_LIST_REPOSITORY_ISSUES',
    ],
  });
  
  const toolNode = new ToolNode(tools);
  
  const model = new ChatCerebras({
    model: 'llama-3.3-70b',
    temperature: 0,
    apiKey: process.env.CEREBRAS_API_KEY,
  }).bindTools(tools);
  
  // Agent node
  async function callModel(state) {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  }
  
  // Tool execution node
  async function callTools(state) {
    return await toolNode.invoke(state);
  }
  
  // Router
  function shouldContinue({ messages }) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.tool_calls?.length) {
      return 'tools';
    }
    return END;
  }
  
  // Build graph
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

// For single-user development (backward compatible)
export const app = await createGitHubAgent('default');
```

### Step 3: User ID Best Practices

#### ✅ Recommended
```javascript
// Database UUID or primary key
const userId = user.id; // "550e8400-e29b-41d4-a716-446655440000"
const session = await composio.create(userId);
```

#### ⚠️ Acceptable
```javascript
// Unique username
const userId = user.username; // "john_doe_123"
const session = await composio.create(userId);
```

#### ❌ Avoid
```javascript
// Email addresses (they can change)
const userId = user.email; // "user@example.com"
```

#### 🚫 Never in Production
```javascript
// 'default' exposes other users' data
const session = await composio.create('default'); // DANGEROUS!
```

## Managing Multiple Connections

Users can have multiple connections to the same toolkit (e.g., work and personal email).

### Example: Work and Personal Gmail

```typescript
const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Create session for user
const session = await composio.create("user_123");

// Connect work email
const workConnection = await session.authorize("gmail", {
  labels: ["work"],
});

// Connect personal email
const personalConnection = await session.authorize("gmail", {
  labels: ["personal"],
});

// Get tools for specific connection
const workTools = await session.tools({
  toolkits: ["gmail"],
  connectedAccountId: workConnection.id,
});

const personalTools = await session.tools({
  toolkits: ["gmail"],
  connectedAccountId: personalConnection.id,
});
```

## Session Methods

### Get Tools
```typescript
const session = await composio.create("user_123");

// Get all tools
const allTools = await session.tools();

// Get specific toolkit tools
const githubTools = await session.tools({
  toolkits: ["github"],
});

// Get specific actions
const specificTools = await session.tools({
  actions: ["GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER"],
});
```

### Authorize User
```typescript
// Authorize user to GitHub
const connectionRequest = await session.authorize("github");

// User visits connectionRequest.redirectUrl to connect
console.log("Connect at:", connectionRequest.redirectUrl);
```

### List Toolkits
```typescript
// List available toolkits and connection status
const toolkits = await session.toolkits();

toolkits.forEach(toolkit => {
  console.log(`${toolkit.name}: ${toolkit.connected ? 'Connected' : 'Not connected'}`);
});
```

### Get MCP Server URL
```typescript
// Get MCP server URL for this user
const mcpUrl = session.mcp.url;
console.log("MCP URL:", mcpUrl);
```

## Implementation Patterns

### Pattern 1: Agent Factory (Recommended)

Create agents on-demand for each user:

```javascript
// agents/github-agent-factory.js
export async function createGitHubAgent(userId) {
  const session = await composio.create(userId);
  const tools = await session.tools({ toolkits: ["github"] });
  // ... build and return agent
}

// Usage in your app
const agent = await createGitHubAgent(req.user.id);
const result = await agent.invoke({ messages: [userMessage] });
```

### Pattern 2: Session Middleware

Add session creation to your request pipeline:

```javascript
// middleware/composio-session.js
export async function composioSessionMiddleware(req, res, next) {
  if (req.user) {
    req.composioSession = await composio.create(req.user.id);
  }
  next();
}

// Usage in route
app.post('/api/agent', composioSessionMiddleware, async (req, res) => {
  const tools = await req.composioSession.tools({ toolkits: ["github"] });
  // ... use tools
});
```

### Pattern 3: Cached Sessions

Cache sessions for performance:

```javascript
// utils/session-cache.js
const sessionCache = new Map();

export async function getOrCreateSession(userId) {
  if (sessionCache.has(userId)) {
    return sessionCache.get(userId);
  }
  
  const session = await composio.create(userId);
  sessionCache.set(userId, session);
  
  // Clear after 1 hour
  setTimeout(() => sessionCache.delete(userId), 3600000);
  
  return session;
}
```

## Migration Checklist

- [ ] Identify user ID source (database ID, username, etc.)
- [ ] Update agents to accept userId parameter
- [ ] Replace `'default'` with actual user IDs
- [ ] Implement session creation in your app
- [ ] Add user authorization flow
- [ ] Test with multiple users
- [ ] Update documentation
- [ ] Deploy to production

## Security Considerations

### ✅ Do
- Use database UUIDs or primary keys as user IDs
- Validate user IDs before creating sessions
- Implement proper authentication
- Isolate user data completely
- Log session creation for audit

### ❌ Don't
- Use `'default'` in production
- Share sessions between users
- Store user IDs in client-side code
- Use predictable user IDs (sequential numbers)
- Expose session details to unauthorized users

## Testing Multi-User Setup

### Test Script

```javascript
// test-multi-user.js
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

async function testMultiUser() {
  // Create sessions for two users
  const user1Session = await composio.create("user_001");
  const user2Session = await composio.create("user_002");
  
  // Get tools for each user
  const user1Tools = await user1Session.tools({ toolkits: ["github"] });
  const user2Tools = await user2Session.tools({ toolkits: ["github"] });
  
  console.log("User 1 tools:", user1Tools.length);
  console.log("User 2 tools:", user2Tools.length);
  
  // Verify isolation
  const user1Toolkits = await user1Session.toolkits();
  const user2Toolkits = await user2Session.toolkits();
  
  console.log("User 1 connected:", user1Toolkits.filter(t => t.connected));
  console.log("User 2 connected:", user2Toolkits.filter(t => t.connected));
}

testMultiUser();
```

## Current Status

Your Ordo project currently uses **single-user mode** with `'default'` user ID:

- ✅ Perfect for development and testing
- ✅ Works immediately without user management
- ⚠️ Not suitable for production with multiple users
- ⚠️ All users would share the same connections

## Next Steps

### For Development (Current)
Continue using `'default'` - it's fine for testing!

### For Production
1. Implement user authentication in your app
2. Update agents to use user-specific sessions
3. Add user authorization flow
4. Test with multiple users
5. Deploy with proper user isolation

## Resources

- **Composio Docs**: https://docs.composio.dev/docs/users-and-sessions
- **Managing Multiple Connections**: https://docs.composio.dev/docs/managing-multiple-connected-accounts
- **Configuring Sessions**: https://docs.composio.dev/docs/configuring-sessions
- **Platform Dashboard**: https://platform.composio.dev

## Example: Full Multi-User App

```javascript
// app.js - Express server with multi-user support
import express from 'express';
import { Composio } from '@composio/core';
import { createGitHubAgent } from './agents/github-agent-factory.js';

const app = express();
const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Middleware to create Composio session
app.use(async (req, res, next) => {
  if (req.user) {
    req.composioSession = await composio.create(req.user.id);
  }
  next();
});

// Connect GitHub for user
app.get('/connect/github', async (req, res) => {
  const connectionRequest = await req.composioSession.authorize("github");
  res.redirect(connectionRequest.redirectUrl);
});

// Use GitHub agent
app.post('/api/github/star', async (req, res) => {
  const agent = await createGitHubAgent(req.user.id);
  const result = await agent.invoke({
    messages: [{ role: 'user', content: `Star repository ${req.body.repo}` }],
  });
  res.json(result);
});

app.listen(3000);
```

---

**Summary:**
- Use `'default'` for development ✅
- Implement user sessions for production 🚀
- Follow best practices for user IDs 🔐
- Test multi-user isolation thoroughly 🧪
