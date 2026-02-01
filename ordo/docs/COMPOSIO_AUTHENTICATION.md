# 🔐 Composio Authentication Guide

## Overview

Panduan lengkap untuk mengautentikasi users dengan Composio, termasuk in-chat authentication dan manual authentication patterns.

## 🎯 Authentication Methods

### 1. In-Chat Authentication (Default)
Agent prompts user to connect during conversation.

### 2. Manual Authentication
Pre-authenticate users before chat or build custom UI.

---

## 🤖 In-Chat Authentication

### How It Works

```
1. User: "Create a GitHub issue"
   ↓
2. Agent calls COMPOSIO_SEARCH_TOOLS
   → Finds GITHUB_CREATE_ISSUE
   ↓
3. Agent calls COMPOSIO_MANAGE_CONNECTIONS
   → Checks connection status
   → Returns: "Not connected"
   → Returns: Connect Link URL
   ↓
4. Agent: "Please connect your GitHub account: [link]"
   ↓
5. User clicks link and authenticates
   ↓
6. User: "Done"
   ↓
7. Agent retries GITHUB_CREATE_ISSUE
   → Success!
```

### Configuration

**Default (In-chat auth enabled):**
```javascript
const session = await composio.create("user_123");
// COMPOSIO_MANAGE_CONNECTIONS meta-tool included automatically
```

**Custom Callback URL:**
```javascript
const session = await composio.create("user_123", {
  manageConnections: {
    callbackUrl: "https://yourapp.com/chat",
  }
});
```

After authentication, user is redirected back to your chat page.

### Example Flow

```javascript
import { Composio } from '@composio/core';
import { ChatCerebras } from '@langchain/cerebras';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Create session with in-chat auth
const session = await composio.create("user_123", {
  manageConnections: {
    callbackUrl: "https://myapp.com/chat",
  }
});

// Get tools (includes COMPOSIO_MANAGE_CONNECTIONS)
const tools = await session.tools();

// Agent will automatically prompt for auth when needed
const model = new ChatCerebras({
  model: 'llama-3.3-70b',
  apiKey: process.env.CEREBRAS_API_KEY,
}).bindTools(tools);

// User: "Create a GitHub issue"
// Agent: "Please connect GitHub: https://connect.composio.dev/link/..."
// User: "Done"
// Agent: "Issue created successfully!"
```

### Benefits

- ✅ Seamless user experience
- ✅ No pre-authentication needed
- ✅ Agent handles auth flow
- ✅ Works in any chat interface
- ✅ Automatic retry after auth

---

## 🔧 Manual Authentication

### When to Use

- Pre-authenticate before chat starts
- Build custom connections UI
- Verify all required connections upfront
- Better control over auth flow

### Basic Usage

```javascript
const session = await composio.create("user_123");

// Generate Connect Link
const connectionRequest = await session.authorize("gmail");
console.log("Connect Gmail:", connectionRequest.redirectUrl);
// https://connect.composio.dev/link/ln_abc123

// Wait for user to complete auth (60 second timeout)
const connectedAccount = await connectionRequest.waitForConnection(60000);
console.log("Connected:", connectedAccount.id);
```

### Check Connection Status

```javascript
const session = await composio.create("user_123");
const toolkits = await session.toolkits();

toolkits.items.forEach((toolkit) => {
  const status = toolkit.connection?.connectedAccount?.id ?? "Not connected";
  console.log(`${toolkit.name}: ${status}`);
});

// Output:
// github: ca_abc123
// gmail: Not connected
// slack: ca_def456
```

### Disable In-Chat Auth

```javascript
// Disable COMPOSIO_MANAGE_CONNECTIONS meta-tool
const session = await composio.create("user_123", {
  manageConnections: false,
});

// Now you handle all auth manually
```

---

## 🎨 Implementation Patterns

### Pattern 1: Pre-Authentication Flow

```javascript
async function ensureConnections(userId, requiredToolkits) {
  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
  
  // Disable in-chat auth
  const session = await composio.create(userId, {
    manageConnections: false,
  });
  
  // Check current connections
  const toolkits = await session.toolkits();
  const connected = toolkits.items
    .filter(t => t.connection?.connectedAccount)
    .map(t => t.slug);
  
  const pending = requiredToolkits.filter(slug => !connected.includes(slug));
  
  console.log("Connected:", connected);
  console.log("Pending:", pending);
  
  // Authenticate pending toolkits
  for (const slug of pending) {
    const request = await session.authorize(slug);
    console.log(`Connect ${slug}: ${request.redirectUrl}`);
    
    // Wait for user to complete
    await request.waitForConnection(60000);
    console.log(`✅ ${slug} connected!`);
  }
  
  console.log("All toolkits connected!");
  return session;
}

// Usage
const session = await ensureConnections("user_123", ["github", "gmail", "slack"]);
```

### Pattern 2: Custom Connections UI

```javascript
// Express.js example
import express from 'express';
import { Composio } from '@composio/core';

const app = express();
const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Get connection status
app.get('/api/connections/:userId', async (req, res) => {
  const session = await composio.create(req.params.userId);
  const toolkits = await session.toolkits();
  
  const connections = toolkits.items.map(toolkit => ({
    name: toolkit.name,
    slug: toolkit.slug,
    connected: !!toolkit.connection?.connectedAccount?.id,
    accountId: toolkit.connection?.connectedAccount?.id,
  }));
  
  res.json({ connections });
});

// Start connection
app.post('/api/connect/:userId/:toolkit', async (req, res) => {
  const { userId, toolkit } = req.params;
  const session = await composio.create(userId);
  
  const request = await session.authorize(toolkit, {
    callbackUrl: `${req.protocol}://${req.get('host')}/callback`,
  });
  
  res.json({ 
    redirectUrl: request.redirectUrl,
    requestId: request.id,
  });
});

// Callback endpoint
app.get('/callback', async (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>✅ Connected Successfully!</h1>
        <p>You can close this window and return to the app.</p>
        <script>
          window.opener?.postMessage({ type: 'auth_complete' }, '*');
          setTimeout(() => window.close(), 2000);
        </script>
      </body>
    </html>
  `);
});

app.listen(3000);
```

### Pattern 3: React Connections Dashboard

```jsx
import { useState, useEffect } from 'react';
import { Composio } from '@composio/core';

function ConnectionsDashboard({ userId }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadConnections();
  }, [userId]);
  
  async function loadConnections() {
    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const session = await composio.create(userId);
    const toolkits = await session.toolkits();
    
    const data = toolkits.items.map(toolkit => ({
      name: toolkit.name,
      slug: toolkit.slug,
      displayName: toolkit.displayName,
      connected: !!toolkit.connection?.connectedAccount?.id,
      accountId: toolkit.connection?.connectedAccount?.id,
      icon: toolkit.icon,
    }));
    
    setConnections(data);
    setLoading(false);
  }
  
  async function handleConnect(slug) {
    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const session = await composio.create(userId);
    
    const request = await session.authorize(slug, {
      callbackUrl: window.location.href,
    });
    
    // Open in popup
    const popup = window.open(
      request.redirectUrl,
      'Connect',
      'width=600,height=700'
    );
    
    // Listen for completion
    window.addEventListener('message', (event) => {
      if (event.data.type === 'auth_complete') {
        popup?.close();
        loadConnections(); // Refresh
      }
    });
  }
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="connections-dashboard">
      <h2>Connected Apps</h2>
      <div className="connections-grid">
        {connections.map(conn => (
          <div key={conn.slug} className="connection-card">
            <img src={conn.icon} alt={conn.name} />
            <h3>{conn.displayName}</h3>
            {conn.connected ? (
              <div className="connected">
                <span>✅ Connected</span>
                <small>{conn.accountId}</small>
              </div>
            ) : (
              <button onClick={() => handleConnect(conn.slug)}>
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 4: Batch Authentication

```javascript
async function connectMultipleToolkits(userId, toolkits) {
  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
  const session = await composio.create(userId, {
    manageConnections: false,
  });
  
  const requests = [];
  
  // Generate all Connect Links
  for (const toolkit of toolkits) {
    const request = await session.authorize(toolkit);
    requests.push({
      toolkit,
      url: request.redirectUrl,
      request,
    });
  }
  
  // Display all links to user
  console.log("Please connect the following:");
  requests.forEach(({ toolkit, url }) => {
    console.log(`${toolkit}: ${url}`);
  });
  
  // Wait for all to complete
  await Promise.all(
    requests.map(({ request }) => request.waitForConnection(120000))
  );
  
  console.log("All toolkits connected!");
}

// Usage
await connectMultipleToolkits("user_123", [
  "github",
  "gmail",
  "slack",
  "jira",
]);
```

### Pattern 5: Conditional Authentication

```javascript
async function createSessionWithAuth(userId, requiredToolkits) {
  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
  
  // Check if all required toolkits are connected
  const checkSession = await composio.create(userId);
  const toolkits = await checkSession.toolkits();
  
  const connected = toolkits.items
    .filter(t => t.connection?.connectedAccount)
    .map(t => t.slug);
  
  const allConnected = requiredToolkits.every(slug => 
    connected.includes(slug)
  );
  
  if (allConnected) {
    // All connected - enable in-chat auth for future needs
    return await composio.create(userId, {
      manageConnections: true,
    });
  } else {
    // Some missing - disable in-chat auth, handle manually
    const session = await composio.create(userId, {
      manageConnections: false,
    });
    
    const pending = requiredToolkits.filter(slug => 
      !connected.includes(slug)
    );
    
    throw new Error(
      `Please connect: ${pending.join(', ')}`
    );
  }
}

// Usage
try {
  const session = await createSessionWithAuth("user_123", [
    "github",
    "gmail"
  ]);
  // Ready to use
} catch (error) {
  // Show connection UI
  console.error(error.message);
}
```

---

## 🎯 Best Practices

### 1. Choose the Right Method

**Use In-Chat Auth when:**
- Building conversational interfaces
- Want seamless UX
- Don't know required toolkits upfront
- Agent discovers needs dynamically

**Use Manual Auth when:**
- Building custom UI
- Need all connections upfront
- Want better control
- Pre-authentication required

### 2. Handle Timeouts

```javascript
try {
  const account = await request.waitForConnection(60000);
  console.log("Connected:", account.id);
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log("Authentication timed out. Please try again.");
  }
}
```

### 3. Provide Clear Instructions

```javascript
const request = await session.authorize("github");

console.log(`
🔐 GitHub Authentication Required

Please click the link below to connect your GitHub account:
${request.redirectUrl}

After connecting, return here and type 'done' to continue.
`);
```

### 4. Check Status Before Operations

```javascript
async function ensureConnected(session, toolkit) {
  const toolkits = await session.toolkits();
  const target = toolkits.items.find(t => t.slug === toolkit);
  
  if (!target?.connection?.connectedAccount) {
    const request = await session.authorize(toolkit);
    throw new Error(`Please connect ${toolkit}: ${request.redirectUrl}`);
  }
}

// Usage
await ensureConnected(session, "github");
// Now safe to use GitHub tools
```

### 5. Handle Multiple Accounts

```javascript
// User has work and personal GitHub
const session = await composio.create("user_123", {
  connectedAccounts: {
    github: "ca_work_github", // Use work account
  }
});
```

---

## 🔄 Complete Example: Chat App with Auth

```javascript
import { Composio } from '@composio/core';
import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import readline from 'readline';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

async function createChatAgent(userId) {
  // Create session with in-chat auth
  const session = await composio.create(userId, {
    manageConnections: {
      callbackUrl: "https://myapp.com/chat",
    }
  });
  
  // Get tools (includes COMPOSIO_MANAGE_CONNECTIONS)
  const tools = await session.tools();
  const toolNode = new ToolNode(tools);
  
  const model = new ChatCerebras({
    model: 'llama-3.3-70b',
    apiKey: process.env.CEREBRAS_API_KEY,
  }).bindTools(tools);
  
  // Build graph
  async function callModel(state) {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  }
  
  async function callTools(state) {
    return await toolNode.invoke(state);
  }
  
  function shouldContinue({ messages }) {
    const lastMessage = messages[messages.length - 1];
    return lastMessage.tool_calls?.length ? 'tools' : END;
  }
  
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

// Interactive chat
async function startChat(userId) {
  const agent = await createChatAgent(userId);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  console.log(`
🤖 Chat Agent Ready!

I can help you with:
• GitHub (create issues, PRs, etc.)
• Gmail (send, read emails)
• Slack (post messages)
• And 800+ more services!

Type 'exit' to quit.
  `);
  
  const messages = [];
  
  while (true) {
    const input = await new Promise(resolve => 
      rl.question('You: ', resolve)
    );
    
    if (input.toLowerCase() === 'exit') break;
    
    messages.push({ role: 'user', content: input });
    
    const result = await agent.invoke({ messages });
    const lastMessage = result.messages[result.messages.length - 1];
    
    console.log('Agent:', lastMessage.content);
    messages.push(lastMessage);
  }
  
  rl.close();
}

// Start
startChat("user_123");
```

---

## 📚 Resources

### Documentation
- **In-Chat Auth**: https://docs.composio.dev/docs/authenticating-users/in-chat-authentication
- **Manual Auth**: https://docs.composio.dev/docs/authenticating-users/manually-authenticating
- **Connect Links**: https://docs.composio.dev/docs/authenticating-tools#hosted-authentication-connect-link

### Platform
- **Dashboard**: https://platform.composio.dev
- **Apps**: https://platform.composio.dev/apps
- **Connections**: https://platform.composio.dev/connections

---

## 🎉 Summary

**Authentication Options:**

1. **In-Chat Auth** (Default)
   - ✅ Seamless UX
   - ✅ Agent handles flow
   - ✅ No pre-auth needed
   - ✅ Works in any chat

2. **Manual Auth**
   - ✅ Custom UI
   - ✅ Pre-authentication
   - ✅ Better control
   - ✅ Batch operations

**Choose based on your needs:**
- Conversational app → In-Chat Auth
- Custom UI → Manual Auth
- Both → Hybrid approach

**Your Ordo agents already support both methods!** 🎯
