# 🎯 Composio Advanced Configuration Guide

## Overview

Panduan lengkap untuk konfigurasi advanced Composio sessions, termasuk toolkit management, custom auth, dan multi-account handling.

## 📚 Session Configuration

### Basic Session Creation

```javascript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Create session for user
const session = await composio.create("user_123");
```

### Enable Specific Toolkits

Restrict session to specific toolkits:

```javascript
// Array format
const session = await composio.create("user_123", {
  toolkits: ["github", "gmail", "slack"]
});

// Object format with enable key
const session = await composio.create("user_123", {
  toolkits: { 
    enable: ["github", "gmail", "slack"] 
  }
});
```

**Use case:** Limit agent to only necessary services for security and performance.

### Disable Specific Toolkits

Keep all toolkits enabled except specific ones:

```javascript
const session = await composio.create("user_123", {
  toolkits: { 
    disable: ["exa", "firecrawl"] 
  }
});
```

**Use case:** Allow access to most services but block specific ones.

### Custom Auth Configs

Use your own OAuth credentials instead of Composio's defaults:

```javascript
const session = await composio.create("user_123", {
  authConfigs: {
    github: "ac_your_github_config",
    slack: "ac_your_slack_config",
  }
});
```

**Use case:** White-label authentication with your own branding.

See: [White-labeling authentication](https://docs.composio.dev/docs/white-labeling-authentication)

### Multiple Account Selection

Specify which connected account to use when user has multiple:

```javascript
const session = await composio.create("user_123", {
  connectedAccounts: {
    gmail: "ca_work_gmail",      // Use work Gmail
    github: "ca_personal_github", // Use personal GitHub
  }
});
```

**Use case:** User has work and personal accounts for same service.

## 🔐 Account Selection Precedence

When executing a tool, connected account is selected in this order:

1. **`connectedAccounts` override** - Explicitly specified in session config
2. **`authConfigs` override** - Finds or creates connection on that config
3. **Previous auth config** - Auth config previously created for toolkit
4. **Composio managed auth** - Creates new auth config using Composio
5. **Error** - If no Composio managed auth scheme exists

If user has multiple accounts, most recently connected one is used by default.

## 🛠️ Session Methods

### 1. Get MCP Server URL

```javascript
const session = await composio.create("user_123");
const mcpUrl = session.mcp.url;

console.log("MCP URL:", mcpUrl);
// Use with MCP-compatible clients
```

### 2. Get Tools

```javascript
const session = await composio.create("user_123");

// Get all tools
const tools = await session.tools();

// Get specific toolkit tools
const githubTools = await session.tools({
  toolkits: ["github"]
});

// Get specific actions
const specificTools = await session.tools({
  actions: ["GITHUB_CREATE_ISSUE"]
});
```

### 3. Authorize User

Manually authenticate user to toolkit:

```javascript
const session = await composio.create("user_123");

// Start authorization
const connectionRequest = await session.authorize("github", {
  callbackUrl: "https://myapp.com/callback",
});

console.log("Visit:", connectionRequest.redirectUrl);

// Wait for user to complete auth
const connectedAccount = await connectionRequest.waitForConnection();
console.log("Connected:", connectedAccount.id);
```

### 4. List Toolkits

Get all toolkits with connection status:

```javascript
const session = await composio.create("user_123");
const toolkits = await session.toolkits();

toolkits.items.forEach((toolkit) => {
  const status = toolkit.connection?.connectedAccount?.id ?? "Not connected";
  console.log(`${toolkit.name}: ${status}`);
});
```

**Output:**
```
github: ca_abc123 (connected)
gmail: ca_def456 (connected)
slack: Not connected
jira: Not connected
```

## 🎯 Advanced Use Cases

### 1. Work vs Personal Accounts

```javascript
// Morning: Use work accounts
const workSession = await composio.create("user_123", {
  connectedAccounts: {
    gmail: "ca_work_gmail",
    slack: "ca_work_slack",
    github: "ca_work_github",
  }
});

// Evening: Use personal accounts
const personalSession = await composio.create("user_123", {
  connectedAccounts: {
    gmail: "ca_personal_gmail",
    github: "ca_personal_github",
  }
});
```

### 2. Department-Specific Access

```javascript
// Engineering team
const engineeringSession = await composio.create("user_123", {
  toolkits: {
    enable: ["github", "gitlab", "jira", "slack"]
  }
});

// Marketing team
const marketingSession = await composio.create("user_123", {
  toolkits: {
    enable: ["mailchimp", "twitter", "linkedin", "hubspot"]
  }
});

// Sales team
const salesSession = await composio.create("user_123", {
  toolkits: {
    enable: ["salesforce", "hubspot", "gmail", "calendar"]
  }
});
```

### 3. Security-Restricted Session

```javascript
// Disable potentially risky toolkits
const restrictedSession = await composio.create("user_123", {
  toolkits: {
    disable: [
      "bash",           // No bash execution
      "python",         // No Python code
      "file_system",    // No file access
    ]
  }
});
```

### 4. White-Label Authentication

```javascript
// Use your own OAuth credentials
const brandedSession = await composio.create("user_123", {
  authConfigs: {
    github: "ac_your_github_oauth",
    google: "ac_your_google_oauth",
  }
});

// Users see YOUR branding during OAuth
```

### 5. Multi-Tenant Application

```javascript
// Tenant A
const tenantASession = await composio.create("tenant_a_user_123", {
  authConfigs: {
    github: "ac_tenant_a_github",
    slack: "ac_tenant_a_slack",
  }
});

// Tenant B
const tenantBSession = await composio.create("tenant_b_user_456", {
  authConfigs: {
    github: "ac_tenant_b_github",
    slack: "ac_tenant_b_slack",
  }
});
```

## 🔄 Dynamic Configuration

### Runtime Toolkit Selection

```javascript
async function createSessionForRole(userId, role) {
  const toolkitsByRole = {
    developer: ["github", "gitlab", "jira", "slack"],
    designer: ["figma", "notion", "slack", "drive"],
    manager: ["jira", "asana", "slack", "calendar"],
    sales: ["salesforce", "hubspot", "gmail", "calendar"],
  };
  
  return await composio.create(userId, {
    toolkits: { enable: toolkitsByRole[role] }
  });
}

// Usage
const devSession = await createSessionForRole("user_123", "developer");
const salesSession = await createSessionForRole("user_456", "sales");
```

### Conditional Account Selection

```javascript
async function createSessionWithAccounts(userId, environment) {
  const accounts = environment === "production" 
    ? {
        github: "ca_prod_github",
        slack: "ca_prod_slack",
      }
    : {
        github: "ca_dev_github",
        slack: "ca_dev_slack",
      };
  
  return await composio.create(userId, {
    connectedAccounts: accounts
  });
}

// Usage
const prodSession = await createSessionWithAccounts("user_123", "production");
const devSession = await createSessionWithAccounts("user_123", "development");
```

## 📊 Connection Management

### Check Connection Status

```javascript
const session = await composio.create("user_123");
const toolkits = await session.toolkits();

// Find connected toolkits
const connected = toolkits.items.filter(t => 
  t.connection?.connectedAccount?.id
);

console.log("Connected toolkits:", connected.map(t => t.name));

// Find disconnected toolkits
const disconnected = toolkits.items.filter(t => 
  !t.connection?.connectedAccount?.id
);

console.log("Need to connect:", disconnected.map(t => t.name));
```

### Bulk Authorization

```javascript
async function connectMultipleToolkits(session, toolkits) {
  const authLinks = [];
  
  for (const toolkit of toolkits) {
    const request = await session.authorize(toolkit);
    authLinks.push({
      toolkit,
      url: request.redirectUrl,
    });
  }
  
  return authLinks;
}

// Usage
const session = await composio.create("user_123");
const links = await connectMultipleToolkits(session, [
  "github",
  "gmail",
  "slack"
]);

links.forEach(({ toolkit, url }) => {
  console.log(`Connect ${toolkit}: ${url}`);
});
```

### Wait for Multiple Connections

```javascript
async function waitForAllConnections(connectionRequests) {
  const promises = connectionRequests.map(req => 
    req.waitForConnection()
  );
  
  return await Promise.all(promises);
}

// Usage
const githubReq = await session.authorize("github");
const gmailReq = await session.authorize("gmail");

const [githubAccount, gmailAccount] = await waitForAllConnections([
  githubReq,
  gmailReq
]);

console.log("GitHub:", githubAccount.id);
console.log("Gmail:", gmailAccount.id);
```

## 🎨 UI Integration Examples

### Connection Status Dashboard

```javascript
async function getConnectionDashboard(userId) {
  const session = await composio.create(userId);
  const toolkits = await session.toolkits();
  
  return toolkits.items.map(toolkit => ({
    name: toolkit.name,
    displayName: toolkit.displayName,
    connected: !!toolkit.connection?.connectedAccount?.id,
    accountId: toolkit.connection?.connectedAccount?.id,
    lastConnected: toolkit.connection?.connectedAccount?.createdAt,
  }));
}

// Usage in React
function ConnectionDashboard({ userId }) {
  const [connections, setConnections] = useState([]);
  
  useEffect(() => {
    getConnectionDashboard(userId).then(setConnections);
  }, [userId]);
  
  return (
    <div>
      {connections.map(conn => (
        <div key={conn.name}>
          <h3>{conn.displayName}</h3>
          <span>{conn.connected ? '✅ Connected' : '❌ Not connected'}</span>
          {!conn.connected && (
            <button onClick={() => connectToolkit(conn.name)}>
              Connect
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Account Switcher

```javascript
async function getAvailableAccounts(userId, toolkit) {
  // Get all connected accounts for toolkit
  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
  const accounts = await composio.connectedAccounts.list({
    userId,
    toolkit,
  });
  
  return accounts;
}

// Usage in UI
function AccountSwitcher({ userId, toolkit }) {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null);
  
  useEffect(() => {
    getAvailableAccounts(userId, toolkit).then(setAccounts);
  }, [userId, toolkit]);
  
  return (
    <select 
      value={selected} 
      onChange={(e) => setSelected(e.target.value)}
    >
      {accounts.map(account => (
        <option key={account.id} value={account.id}>
          {account.label || account.id}
        </option>
      ))}
    </select>
  );
}
```

## 🔒 Security Best Practices

### 1. Principle of Least Privilege

```javascript
// Only enable necessary toolkits
const session = await composio.create(userId, {
  toolkits: {
    enable: ["github"] // Only what's needed
  }
});
```

### 2. Environment-Based Configuration

```javascript
const session = await composio.create(userId, {
  toolkits: {
    disable: process.env.NODE_ENV === "production" 
      ? ["bash", "python"] // Disable in prod
      : [] // Allow in dev
  }
});
```

### 3. Audit Logging

```javascript
async function createAuditedSession(userId, config) {
  console.log(`[AUDIT] Creating session for ${userId}`, {
    toolkits: config.toolkits,
    timestamp: new Date().toISOString(),
  });
  
  const session = await composio.create(userId, config);
  
  console.log(`[AUDIT] Session created: ${session.sessionId}`);
  
  return session;
}
```

### 4. Token Rotation

```javascript
// Regularly check and refresh connections
async function refreshExpiredConnections(userId) {
  const session = await composio.create(userId);
  const toolkits = await session.toolkits();
  
  for (const toolkit of toolkits.items) {
    if (toolkit.connection?.isExpired) {
      console.log(`Refreshing ${toolkit.name}...`);
      await session.authorize(toolkit.name);
    }
  }
}
```

## 📚 Resources

### Documentation
- **Composio Docs**: https://docs.composio.dev
- **Configuring Sessions**: https://docs.composio.dev/docs/configuring-sessions
- **White-labeling Auth**: https://docs.composio.dev/docs/white-labeling-authentication
- **Custom Auth Configs**: https://docs.composio.dev/docs/using-custom-auth-configuration

### Platform
- **Dashboard**: https://platform.composio.dev
- **Apps**: https://platform.composio.dev/apps
- **Settings**: https://platform.composio.dev/settings

## 🎯 Summary

Advanced Composio configuration memungkinkan:

- ✅ Toolkit restriction (enable/disable)
- ✅ Custom OAuth credentials
- ✅ Multiple account management
- ✅ White-label authentication
- ✅ Role-based access control
- ✅ Environment-specific configs
- ✅ Security best practices
- ✅ UI integration patterns

**Use these features untuk:**
- Multi-tenant applications
- Role-based access
- Work/personal account separation
- White-label solutions
- Security-restricted environments
- Department-specific access

---

**Ready untuk advanced configuration?** Lihat contoh-contoh di atas dan sesuaikan dengan kebutuhan Anda!
