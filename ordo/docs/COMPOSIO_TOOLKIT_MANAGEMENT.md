# 🛠️ Composio Toolkit Management Guide

## Overview

Panduan lengkap untuk mengelola toolkits dan tools di Composio, termasuk fetching, enabling, disabling, dan filtering by tags.

---

## 📋 Fetching Toolkits

### List All Enabled Toolkits

```javascript
const session = await composio.create("user_123");
const result = await session.toolkits();

for (const toolkit of result.items) {
  console.log(`${toolkit.name}: ${toolkit.connection?.isActive ?? 'not connected'}`);
}

// Output:
// GitHub: true
// Gmail: false
// Slack: true
```

### Filter Connected Only

```javascript
// Only show connected toolkits
const connected = await session.toolkits({ isConnected: true });

connected.items.forEach(toolkit => {
  console.log(`✅ ${toolkit.name} (${toolkit.slug})`);
});
```

### Pagination (Get All Toolkits)

```javascript
const allToolkits = [];
let cursor;

do {
  const { items, nextCursor } = await session.toolkits({ 
    limit: 20, 
    nextCursor: cursor 
  });
  
  allToolkits.push(...items);
  cursor = nextCursor;
} while (cursor);

console.log(`Total toolkits: ${allToolkits.length}`);
```

### Get Meta Tools

```javascript
// Get 5 meta tools formatted for your provider
const tools = await session.tools();

console.log("Meta tools:", tools.map(t => t.name));
// [
//   "COMPOSIO_SEARCH_TOOLS",
//   "COMPOSIO_MANAGE_CONNECTIONS",
//   "COMPOSIO_MULTI_EXECUTE_TOOL",
//   "COMPOSIO_REMOTE_WORKBENCH",
//   "COMPOSIO_REMOTE_BASH_TOOL"
// ]
```

---

## 🔍 Browsing the Catalog

### List All Available Toolkits

```javascript
const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Get all toolkits (no user context needed)
const toolkits = await composio.toolkits.get();

console.log(`Available toolkits: ${toolkits.length}`);
toolkits.forEach(toolkit => {
  console.log(`- ${toolkit.name} (${toolkit.slug})`);
});
```

### List Tools in a Toolkit

```javascript
// Get tools for specific toolkit
const tools = await composio.tools.get("user_123", { 
  toolkits: ["GITHUB"] 
});

console.log("GitHub tools:");
tools.forEach(tool => {
  console.log(`- ${tool.name}: ${tool.description}`);
});
```

### Get Tool Schema

```javascript
// Inspect tool without user context
const tool = await composio.tools.getRawComposioToolBySlug("GMAIL_SEND_EMAIL");

console.log("Tool:", tool.name);
console.log("Description:", tool.description);
console.log("Input parameters:", tool.inputParameters);
console.log("Output parameters:", tool.outputParameters);

// Example output:
// Tool: GMAIL_SEND_EMAIL
// Description: Send an email via Gmail
// Input parameters: {
//   to: { type: "string", required: true },
//   subject: { type: "string", required: true },
//   body: { type: "string", required: true },
//   cc: { type: "array", required: false },
//   ...
// }
```

---

## ✅ Enabling Specific Toolkits

### Array Format

```javascript
// Only GitHub and Gmail available
const session = await composio.create("user_123", {
  toolkits: ["github", "gmail"]
});
```

### Object Format

```javascript
// Explicit enable syntax
const session = await composio.create("user_123", {
  toolkits: { 
    enable: ["github", "gmail", "slack"] 
  }
});
```

### Use Cases

**Developer Agent:**
```javascript
const devSession = await composio.create("user_123", {
  toolkits: ["github", "gitlab", "jira", "slack"]
});
```

**Marketing Agent:**
```javascript
const marketingSession = await composio.create("user_123", {
  toolkits: ["mailchimp", "twitter", "linkedin", "hubspot"]
});
```

**Sales Agent:**
```javascript
const salesSession = await composio.create("user_123", {
  toolkits: ["salesforce", "hubspot", "gmail", "calendar"]
});
```

---

## ❌ Disabling Specific Toolkits

### Disable Syntax

```javascript
// All toolkits available EXCEPT Linear and Jira
const session = await composio.create("user_123", {
  toolkits: { 
    disable: ["linear", "jira"] 
  }
});
```

### Security Use Case

```javascript
// Disable potentially risky toolkits
const restrictedSession = await composio.create("user_123", {
  toolkits: {
    disable: [
      "bash",           // No bash execution
      "python",         // No Python code
      "file_system",    // No file access
      "terminal",       // No terminal access
    ]
  }
});
```

---

## 🎯 Tool-Level Control

### Enable Specific Tools

```javascript
const session = await composio.create("user_123", {
  tools: {
    // Only these Gmail tools
    gmail: { 
      enable: ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"] 
    },
    
    // Only issue-related GitHub tools
    github: { 
      enable: ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"] 
    }
  }
});
```

### Shorthand Array Syntax

```javascript
// Equivalent to enable
const session = await composio.create("user_123", {
  tools: {
    gmail: ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"],
    github: ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"]
  }
});
```

### Disable Specific Tools

```javascript
const session = await composio.create("user_123", {
  tools: {
    // All Slack tools EXCEPT delete
    slack: { 
      disable: ["SLACK_DELETE_MESSAGE"] 
    },
    
    // All GitHub tools EXCEPT destructive ones
    github: { 
      disable: [
        "GITHUB_DELETE_REPO",
        "GITHUB_DELETE_BRANCH",
        "GITHUB_DELETE_FILE"
      ] 
    }
  }
});
```

---

## 🏷️ Filtering by Tags

### Available Tags

| Tag | Description |
|-----|-------------|
| `readOnlyHint` | Tools that only read data |
| `destructiveHint` | Tools that modify or delete data |
| `idempotentHint` | Tools that can be safely retried |
| `openWorldHint` | Tools that operate in open world context |

### Global Tag Filtering

```javascript
// Only read-only and idempotent tools
const session = await composio.create("user_123", {
  tags: ["readOnlyHint", "idempotentHint"]
});
```

### Enable/Disable Tags

```javascript
const session = await composio.create("user_123", {
  tags: {
    enable: ["readOnlyHint"],
    disable: ["destructiveHint"]
  }
});
```

### Per-Toolkit Tag Override

```javascript
const session = await composio.create("user_123", {
  // Global: only read-only tools
  tags: ["readOnlyHint"],
  
  tools: {
    // Override for GitHub: allow all except destructive
    github: { 
      tags: { disable: ["destructiveHint"] } 
    },
    
    // Override for Gmail: only read-only (explicit)
    gmail: { 
      tags: ["readOnlyHint"] 
    }
  }
});
```

---

## 🎨 Advanced Patterns

### Pattern 1: Read-Only Agent

```javascript
// Agent can only read, never modify
const readOnlySession = await composio.create("user_123", {
  tags: ["readOnlyHint"]
});

// Can: Read emails, view issues, list files
// Cannot: Send emails, create issues, delete files
```

### Pattern 2: Safe Agent

```javascript
// Agent can do everything except destructive actions
const safeSession = await composio.create("user_123", {
  tags: {
    disable: ["destructiveHint"]
  }
});

// Can: Create, update, read
// Cannot: Delete, remove, destroy
```

### Pattern 3: Idempotent Agent

```javascript
// Agent can only use tools that are safe to retry
const idempotentSession = await composio.create("user_123", {
  tags: ["idempotentHint"]
});

// Safe for automatic retries
// No side effects from multiple executions
```

### Pattern 4: Role-Based Access

```javascript
async function createSessionForRole(userId, role) {
  const configs = {
    viewer: {
      tags: ["readOnlyHint"],
      toolkits: ["github", "gmail", "slack"]
    },
    
    editor: {
      tags: { disable: ["destructiveHint"] },
      toolkits: ["github", "gmail", "slack", "jira"]
    },
    
    admin: {
      // All tools available
      toolkits: { enable: [] } // Empty = all
    }
  };
  
  return await composio.create(userId, configs[role]);
}

// Usage
const viewerSession = await createSessionForRole("user_123", "viewer");
const editorSession = await createSessionForRole("user_456", "editor");
const adminSession = await createSessionForRole("user_789", "admin");
```

### Pattern 5: Environment-Based

```javascript
const session = await composio.create("user_123", {
  tags: process.env.NODE_ENV === "production"
    ? { disable: ["destructiveHint"] } // Safe in prod
    : [] // Allow all in dev
});
```

### Pattern 6: Toolkit + Tool Combination

```javascript
const session = await composio.create("user_123", {
  // Enable specific toolkits
  toolkits: ["github", "gmail", "slack"],
  
  // Fine-tune tools within those toolkits
  tools: {
    github: {
      // Only safe GitHub operations
      disable: [
        "GITHUB_DELETE_REPO",
        "GITHUB_DELETE_BRANCH",
        "GITHUB_FORCE_PUSH"
      ]
    },
    
    gmail: {
      // Only email reading and sending
      enable: [
        "GMAIL_FETCH_EMAILS",
        "GMAIL_SEND_EMAIL",
        "GMAIL_SEARCH_EMAILS"
      ]
    },
    
    slack: {
      // All Slack tools except delete
      disable: ["SLACK_DELETE_MESSAGE"]
    }
  },
  
  // Global tag filter
  tags: { disable: ["destructiveHint"] }
});
```

---

## 📊 Toolkit Discovery UI

### React Component Example

```jsx
import { useState, useEffect } from 'react';
import { Composio } from '@composio/core';

function ToolkitBrowser({ userId }) {
  const [toolkits, setToolkits] = useState([]);
  const [filter, setFilter] = useState('all'); // all, connected, available
  
  useEffect(() => {
    loadToolkits();
  }, [userId, filter]);
  
  async function loadToolkits() {
    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const session = await composio.create(userId);
    
    const result = await session.toolkits({
      isConnected: filter === 'connected' ? true : undefined
    });
    
    setToolkits(result.items);
  }
  
  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('connected')}>Connected</button>
      </div>
      
      <div className="toolkit-grid">
        {toolkits.map(toolkit => (
          <div key={toolkit.slug} className="toolkit-card">
            <img src={toolkit.logo} alt={toolkit.name} />
            <h3>{toolkit.name}</h3>
            <p>{toolkit.description}</p>
            <span className={toolkit.connection?.isActive ? 'connected' : 'not-connected'}>
              {toolkit.connection?.isActive ? '✅ Connected' : '❌ Not connected'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Tool Inspector

```javascript
async function inspectTool(toolSlug) {
  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
  const tool = await composio.tools.getRawComposioToolBySlug(toolSlug);
  
  return {
    name: tool.name,
    description: tool.description,
    inputs: Object.entries(tool.inputParameters).map(([name, schema]) => ({
      name,
      type: schema.type,
      required: schema.required,
      description: schema.description,
    })),
    outputs: Object.entries(tool.outputParameters).map(([name, schema]) => ({
      name,
      type: schema.type,
      description: schema.description,
    })),
    tags: tool.tags,
  };
}

// Usage
const toolInfo = await inspectTool("GMAIL_SEND_EMAIL");
console.log(JSON.stringify(toolInfo, null, 2));
```

---

## 🔒 Security Best Practices

### 1. Principle of Least Privilege

```javascript
// Only enable what's needed
const session = await composio.create("user_123", {
  toolkits: ["github"], // Only GitHub
  tools: {
    github: ["GITHUB_CREATE_ISSUE"] // Only create issues
  }
});
```

### 2. Disable Destructive Actions

```javascript
const session = await composio.create("user_123", {
  tags: { disable: ["destructiveHint"] }
});
```

### 3. Read-Only for Viewers

```javascript
const viewerSession = await composio.create("user_123", {
  tags: ["readOnlyHint"]
});
```

### 4. Environment-Based Restrictions

```javascript
const session = await composio.create("user_123", {
  toolkits: {
    disable: process.env.NODE_ENV === "production"
      ? ["bash", "python", "terminal"]
      : []
  }
});
```

### 5. Audit Logging

```javascript
async function createAuditedSession(userId, config) {
  console.log(`[AUDIT] Creating session for ${userId}`, {
    toolkits: config.toolkits,
    tools: config.tools,
    tags: config.tags,
    timestamp: new Date().toISOString(),
  });
  
  const session = await composio.create(userId, config);
  
  console.log(`[AUDIT] Session created: ${session.sessionId}`);
  
  return session;
}
```

---

## 📚 Complete Examples

### Example 1: Customer Support Agent

```javascript
const supportSession = await composio.create("support_agent_123", {
  // Only support-related toolkits
  toolkits: ["zendesk", "intercom", "gmail", "slack"],
  
  // Fine-tune tools
  tools: {
    zendesk: {
      // Can create and update tickets, but not delete
      disable: ["ZENDESK_DELETE_TICKET"]
    },
    
    gmail: {
      // Can read and send, but not delete
      enable: [
        "GMAIL_FETCH_EMAILS",
        "GMAIL_SEND_EMAIL",
        "GMAIL_SEARCH_EMAILS"
      ]
    }
  },
  
  // No destructive actions
  tags: { disable: ["destructiveHint"] }
});
```

### Example 2: DevOps Agent

```javascript
const devopsSession = await composio.create("devops_123", {
  // DevOps toolkits
  toolkits: ["github", "gitlab", "jenkins", "docker", "aws"],
  
  // Allow most operations but be careful with destructive ones
  tags: {
    enable: ["idempotentHint"], // Prefer idempotent
    disable: [] // Allow destructive if needed
  },
  
  tools: {
    aws: {
      // No resource deletion in production
      disable: process.env.NODE_ENV === "production"
        ? ["AWS_DELETE_INSTANCE", "AWS_DELETE_BUCKET"]
        : []
    }
  }
});
```

### Example 3: Marketing Automation

```javascript
const marketingSession = await composio.create("marketing_123", {
  // Marketing toolkits
  toolkits: [
    "mailchimp",
    "sendgrid",
    "twitter",
    "linkedin",
    "facebook",
    "hubspot"
  ],
  
  // Only safe operations
  tags: { disable: ["destructiveHint"] },
  
  tools: {
    twitter: {
      // Can post but not delete
      disable: ["TWITTER_DELETE_TWEET"]
    },
    
    mailchimp: {
      // Can create campaigns but not delete lists
      disable: ["MAILCHIMP_DELETE_LIST"]
    }
  }
});
```

---

## 🎯 Summary

**Toolkit Management allows you to:**

- ✅ Enable specific toolkits
- ✅ Disable unwanted toolkits
- ✅ Control individual tools
- ✅ Filter by behavior tags
- ✅ Role-based access control
- ✅ Environment-based configs
- ✅ Security restrictions
- ✅ Fine-grained control

**Use these features for:**
- Security (disable destructive actions)
- Performance (load only needed tools)
- User experience (relevant tools only)
- Compliance (restrict access)
- Testing (safe operations only)

---

**Your Ordo agents support all these configurations!** 🎯

Configure your agents based on your specific needs and security requirements.
