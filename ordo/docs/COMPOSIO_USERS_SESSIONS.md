# 👥 Composio Users & Sessions Guide

## Overview

Panduan lengkap untuk membangun multi-user AI agents dengan Composio. Setiap user memiliki connections dan context sendiri yang terisolasi menggunakan **users** dan **sessions**.

---

## 🧑 Users

### What is a User?

**User** adalah identifier dari aplikasi Anda. Ketika seseorang menghubungkan Gmail atau GitHub mereka, connection tersebut disimpan di bawah user ID mereka, sehingga tools selalu berjalan dengan authentication yang tepat.

### Key Concepts

- **Isolation**: Connections sepenuhnya terisolasi antar user IDs
- **Multiple Connections**: Satu user dapat memiliki multiple connections ke toolkit yang sama
- **Context**: Setiap tool execution menggunakan user ID untuk identifikasi

### Best Practices for User IDs

✅ **Recommended:**
```javascript
// Database UUID atau primary key
const userId = user.id;  // "550e8400-e29b-41d4-a716-446655440000"
```

✅ **Acceptable:**
```javascript
// Unique username
const userId = user.username;  // "john_doe_123"
```

⚠️ **Avoid:**
```javascript
// Email addresses (dapat berubah)
const userId = user.email;  // "john@example.com"
```

❌ **Never in Production:**
```javascript
// 'default' exposes other users' data!
const userId = 'default';
```

### Multiple Connections per User

User dapat memiliki multiple connections ke toolkit yang sama. Misalnya, work email dan personal email:

```javascript
// User yang sama, connections berbeda
const session1 = await composio.create("user_123");
const workEmail = await session1.authorize("gmail", {
  connectionId: "work_email"
});

const session2 = await composio.create("user_123");
const personalEmail = await session2.authorize("gmail", {
  connectionId: "personal_email"
});
```

---

## 🔄 Sessions

### What is a Session?

**Session** adalah ephemeral configuration yang menentukan:
- User mana yang akan digunakan untuk authorization dan data
- Toolkits mana yang enabled atau disabled
- Authentication method, scopes, dan credentials apa yang digunakan

### Creating a Session

**TypeScript/JavaScript:**
```javascript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: 'your_api_key' });

// Create session for specific user
const session = await composio.create("user_123");
```

**Python:**
```python
from composio import Composio

composio = Composio(api_key="your_api_key")

# Create session for specific user
session = composio.create(user_id="user_123")
```

---

## 🛠️ Session Methods

### 1. Get Tools

**TypeScript:**
```javascript
// Get all meta tools
const tools = await session.tools();

// Get specific toolkit tools
const githubTools = await session.tools({
  toolkits: ['github']
});

// Get specific actions
const specificTools = await session.tools({
  actions: ['GITHUB_CREATE_ISSUE', 'GITHUB_STAR_REPOSITORY']
});
```

**Python:**
```python
# Get all meta tools
tools = session.tools()

# Get specific toolkit tools
github_tools = session.tools(toolkits=['github'])

# Get specific actions
specific_tools = session.tools(
    actions=['GITHUB_CREATE_ISSUE', 'GITHUB_STAR_REPOSITORY']
)
```

### 2. Get MCP Server URL

**TypeScript:**
```javascript
const mcpUrl = session.mcp.url;
console.log('MCP Server:', mcpUrl);
```

**Python:**
```python
mcp_url = session.mcp.url
print(f"MCP Server: {mcp_url}")
```

### 3. Authenticate User

**TypeScript:**
```javascript
// Authorize user to a toolkit
const connectionRequest = await session.authorize("github");
console.log('Auth URL:', connectionRequest.redirectUrl);

// With custom config
const connectionRequest = await session.authorize("github", {
  scopes: ['repo', 'user'],
  connectionId: 'work_github'
});
```

**Python:**
```python
# Authorize user to a toolkit
connection_request = session.authorize("github")
print(f"Auth URL: {connection_request.redirect_url}")

# With custom config
connection_request = session.authorize(
    "github",
    scopes=['repo', 'user'],
    connection_id='work_github'
)
```

### 4. List Available Toolkits

**TypeScript:**
```javascript
// List all toolkits with connection status
const toolkits = await session.toolkits();

toolkits.forEach(toolkit => {
  console.log(`${toolkit.name}: ${toolkit.connected ? '✅' : '❌'}`);
});
```

**Python:**
```python
# List all toolkits with connection status
toolkits = session.toolkits()

for toolkit in toolkits:
    status = "✅" if toolkit.connected else "❌"
    print(f"{toolkit.name}: {status}")
```

---

## 🎯 Complete Examples

### Example 1: Basic Session Usage

**TypeScript:**
```javascript
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new LangchainProvider()
});

async function setupUserSession(userId) {
  // Create session
  const session = await composio.create(userId);
  
  // Get tools
  const tools = await session.tools();
  console.log(`Loaded ${tools.length} meta tools`);
  
  // Check toolkit status
  const toolkits = await session.toolkits();
  const github = toolkits.find(t => t.name === 'github');
  
  if (!github.connected) {
    // User needs to authenticate
    const auth = await session.authorize('github');
    console.log('Please authenticate:', auth.redirectUrl);
  } else {
    console.log('GitHub already connected!');
  }
  
  return { session, tools };
}

// Usage
const { session, tools } = await setupUserSession('user_123');
```

**Python:**
```python
from composio import Composio

composio = Composio(api_key=os.getenv("COMPOSIO_API_KEY"))

def setup_user_session(user_id):
    # Create session
    session = composio.create(user_id)
    
    # Get tools
    tools = session.tools()
    print(f"Loaded {len(tools)} meta tools")
    
    # Check toolkit status
    toolkits = session.toolkits()
    github = next((t for t in toolkits if t.name == 'github'), None)
    
    if not github.connected:
        # User needs to authenticate
        auth = session.authorize('github')
        print(f"Please authenticate: {auth.redirect_url}")
    else:
        print("GitHub already connected!")
    
    return session, tools

# Usage
session, tools = setup_user_session('user_123')
```

### Example 2: Multi-User Agent

**TypeScript:**
```javascript
import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';
import { ToolNode } from '@langchain/langgraph/prebuilt';

class MultiUserAgent {
  constructor() {
    this.composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
      provider: new LangchainProvider()
    });
    this.sessions = new Map();
  }
  
  async getSession(userId) {
    if (!this.sessions.has(userId)) {
      const session = await this.composio.create(userId);
      this.sessions.set(userId, session);
    }
    return this.sessions.get(userId);
  }
  
  async createAgent(userId) {
    const session = await this.getSession(userId);
    const tools = await session.tools();
    const toolNode = new ToolNode(tools);
    
    const model = new ChatCerebras({
      model: 'llama-3.3-70b',
      temperature: 0,
      apiKey: process.env.CEREBRAS_API_KEY
    }).bindTools(tools);
    
    // Build graph
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode('agent', async (state) => {
        const response = await model.invoke(state.messages);
        return { messages: [response] };
      })
      .addNode('tools', toolNode)
      .addEdge('__start__', 'agent')
      .addConditionalEdges('agent', ({ messages }) => {
        const last = messages[messages.length - 1];
        return last.tool_calls?.length ? 'tools' : '__end__';
      })
      .addEdge('tools', 'agent');
    
    return workflow.compile();
  }
}

// Usage
const multiUserAgent = new MultiUserAgent();

// User 1
const agent1 = await multiUserAgent.createAgent('user_123');
await agent1.invoke({
  messages: [{ role: 'user', content: 'Create a GitHub issue' }]
});

// User 2
const agent2 = await multiUserAgent.createAgent('user_456');
await agent2.invoke({
  messages: [{ role: 'user', content: 'Send an email' }]
});
```

### Example 3: Express Server with Sessions

**TypeScript:**
```javascript
import express from 'express';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

const app = express();
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new LangchainProvider()
});

// Store sessions per user
const sessions = new Map();

app.get('/api/session/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Get or create session
    let session = sessions.get(userId);
    if (!session) {
      session = await composio.create(userId);
      sessions.set(userId, session);
    }
    
    // Get toolkit status
    const toolkits = await session.toolkits();
    
    res.json({
      userId,
      toolkits: toolkits.map(t => ({
        name: t.name,
        connected: t.connected
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/authorize/:userId/:toolkit', async (req, res) => {
  const { userId, toolkit } = req.params;
  
  try {
    const session = await composio.create(userId);
    const auth = await session.authorize(toolkit);
    
    res.json({
      redirectUrl: auth.redirectUrl,
      message: 'Please visit the URL to authenticate'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## 🔐 Managing Multiple Connections

### Scenario: Work & Personal Email

```javascript
// User connects work email
const session1 = await composio.create("user_123");
const workAuth = await session1.authorize("gmail", {
  connectionId: "work_email",
  scopes: ['gmail.send', 'gmail.readonly']
});

// User connects personal email
const session2 = await composio.create("user_123");
const personalAuth = await session2.authorize("gmail", {
  connectionId: "personal_email",
  scopes: ['gmail.send', 'gmail.readonly']
});

// Use specific connection
const workTools = await session1.tools({
  toolkits: ['gmail'],
  connectionId: 'work_email'
});

const personalTools = await session2.tools({
  toolkits: ['gmail'],
  connectionId: 'personal_email'
});
```

### Listing User Connections

```javascript
const session = await composio.create("user_123");
const connections = await session.connections();

connections.forEach(conn => {
  console.log(`${conn.toolkit}: ${conn.connectionId} (${conn.status})`);
});

// Output:
// gmail: work_email (active)
// gmail: personal_email (active)
// github: default (active)
```

---

## 🎯 Session Configuration

### Enable/Disable Toolkits

```javascript
const session = await composio.create("user_123", {
  enabledToolkits: ['github', 'gmail'],  // Only these
  disabledToolkits: ['slack']            // Exclude this
});
```

### Custom Auth Config

```javascript
const session = await composio.create("user_123");

const auth = await session.authorize("github", {
  scopes: ['repo', 'user', 'admin:org'],
  redirectUrl: 'https://myapp.com/callback',
  connectionId: 'work_github'
});
```

### Select Specific Connection

```javascript
// Get tools for specific connection
const tools = await session.tools({
  toolkits: ['gmail'],
  connectionId: 'work_email'
});
```

---

## 💡 Best Practices

### 1. User ID Selection

```javascript
// ✅ Good: Use database ID
const userId = user.id;  // UUID from database

// ✅ Good: Use unique username
const userId = user.username;  // "john_doe_123"

// ❌ Bad: Use email (can change)
const userId = user.email;

// ❌ Bad: Use 'default' in production
const userId = 'default';
```

### 2. Session Lifecycle

```javascript
// Create session once per user
const session = await composio.create(userId);

// Reuse session for multiple operations
const tools1 = await session.tools();
const toolkits = await session.toolkits();
const auth = await session.authorize('github');
```

### 3. Connection Management

```javascript
// Check connection before using
const toolkits = await session.toolkits();
const github = toolkits.find(t => t.name === 'github');

if (!github.connected) {
  const auth = await session.authorize('github');
  return { needsAuth: true, authUrl: auth.redirectUrl };
}

// Proceed with tools
const tools = await session.tools({ toolkits: ['github'] });
```

### 4. Error Handling

```javascript
try {
  const session = await composio.create(userId);
  const tools = await session.tools();
} catch (error) {
  if (error.message.includes('authentication')) {
    // Handle auth error
    const auth = await session.authorize('github');
    console.log('Please authenticate:', auth.redirectUrl);
  } else {
    // Handle other errors
    console.error('Session error:', error);
  }
}
```

---

## 🔄 Session Correlation

Meta tool calls dalam session di-korelasikan menggunakan `session_id`, memungkinkan mereka berbagi context:

```javascript
// All these calls share context via session_id
const session = await composio.create("user_123");

// 1. Search for tools
const searchResult = await COMPOSIO_SEARCH_TOOLS({
  query: "create github issue"
});

// 2. Check connection (knows about previous search)
const connectionStatus = await COMPOSIO_MANAGE_CONNECTIONS({
  toolkit: "github"
});

// 3. Execute tool (knows about search and connection)
const result = await COMPOSIO_MULTI_EXECUTE_TOOL({
  tool: "GITHUB_CREATE_ISSUE",
  args: { title: "Bug", body: "Fix this" }
});
```

---

## 📊 Session vs Default

| Feature | Default User | Session per User |
|---------|--------------|------------------|
| **Isolation** | ❌ Shared | ✅ Isolated |
| **Security** | ❌ Low | ✅ High |
| **Multi-user** | ❌ No | ✅ Yes |
| **Production** | ❌ Never | ✅ Always |
| **Development** | ✅ OK | ✅ Better |

---

## 🚀 Quick Start

### Step 1: Create Session

```javascript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const session = await composio.create("user_123");
```

### Step 2: Get Tools

```javascript
const tools = await session.tools();
console.log(`Loaded ${tools.length} tools`);
```

### Step 3: Check Connections

```javascript
const toolkits = await session.toolkits();
toolkits.forEach(t => {
  console.log(`${t.name}: ${t.connected ? '✅' : '❌'}`);
});
```

### Step 4: Authorize if Needed

```javascript
const github = toolkits.find(t => t.name === 'github');
if (!github.connected) {
  const auth = await session.authorize('github');
  console.log('Auth URL:', auth.redirectUrl);
}
```

### Step 5: Use Tools

```javascript
// Tools now execute with user's permissions
const result = await COMPOSIO_MULTI_EXECUTE_TOOL({
  tool: "GITHUB_CREATE_ISSUE",
  args: { title: "Bug", body: "Description" }
});
```

---

## 📚 Resources

### Documentation
- **Users & Sessions**: https://docs.composio.dev/docs/users-and-sessions
- **Configuring Sessions**: https://docs.composio.dev/docs/configuring-sessions
- **Managing Connections**: https://docs.composio.dev/docs/managing-multiple-connected-accounts

### Platform
- **Dashboard**: https://platform.composio.dev
- **Connections**: https://platform.composio.dev/apps
- **API Keys**: https://platform.composio.dev/settings

---

## 🎉 Summary

**Users & Sessions** memberikan:

- ✅ Isolated connections per user
- ✅ Secure multi-user support
- ✅ Multiple connections per toolkit
- ✅ Custom auth configurations
- ✅ Connection management
- ✅ Session correlation
- ✅ Production-ready architecture

**Ready for multi-user agents?** 🎯

Start with:
```javascript
const session = await composio.create(userId);
const tools = await session.tools();
```

---

**Note:** Always use user-specific sessions in production. Never use 'default' user ID as it exposes other users' data!
