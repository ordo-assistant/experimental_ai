# Composio Updates & Compatibility

## 📅 Latest Updates (Jan 2026)

### SDK 0.6.0 - Major Update (Jan 29, 2026)
- ✅ **Cloudflare Workers Support** - Deploy agents on edge
- ⚠️ **Breaking Changes** - Review migration guide
- 🔧 **Simplified Schemas** - Optional fields handling improved

### Recent Important Changes

1. **Tool Router GA** (Dec 15, 2025)
   - Automatically route to best tool for task
   - Improved tool selection

2. **MCP Support** (Sep 26, 2025)
   - Model Context Protocol integration
   - Enhanced tool discovery

3. **Toolkit Versioning** (Sep 16, 2025)
   - Version-specific tool execution
   - Better compatibility

## 🔄 Migration Notes

### From SDK 0.5.x to 0.6.x

#### Breaking Changes

1. **Import Changes**
```javascript
// Old (0.5.x)
import { Composio } from 'composio-core';

// New (0.6.x)
import { Composio } from '@composio/core';
```

2. **Provider Initialization**
```javascript
// Old
const composio = new Composio(apiKey);

// New
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new LangchainProvider(),
});
```

3. **Tool Fetching**
```javascript
// Old
const tools = await composio.getTools(['GITHUB']);

// New
const tools = await composio.tools.get('default', ['GITHUB']);
```

## ✅ Your Current Setup

Your Ordo project is using the **latest Composio SDK (0.6.x)** with:

- ✅ Correct imports (`@composio/core`)
- ✅ Proper provider initialization
- ✅ Updated tool fetching syntax
- ✅ MCP support ready
- ✅ Tool Router compatible

## 🔧 Configuration Updates

### Auth Config (Jan 14, 2026)
Now supports true PATCH semantics for partial updates:

```javascript
// Update only specific fields
await composio.updateAuthConfig({
  integrationId: 'github',
  clientId: 'new-client-id',
  // Other fields remain unchanged
});
```

### Connected Accounts (Jan 21, 2026)
Initiate now filters by ACTIVE status automatically:

```javascript
// Automatically filters active connections
const accounts = await composio.connectedAccounts.list();
```

### Tool Execution (Jan 20, 2026)
File handling now uses presigned URLs:

```javascript
// Files automatically handled via presigned URLs
const result = await composio.executeAction({
  action: 'GITHUB_CREATE_FILE',
  params: {
    file: fileBuffer, // Automatically uploaded
  },
});
```

## 🚀 New Features Available

### 1. Tool Router (GA)
Automatically select best tool for task:

```javascript
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  useToolRouter: true, // Enable automatic routing
});

// Router selects best tool automatically
const result = await composio.executeAction({
  description: "Star a repository on GitHub",
  params: { repo: "composiohq/composio" },
});
```

### 2. Assistive Prompts (Experimental)
Get AI-generated prompts for better tool usage:

```javascript
const prompt = await composio.getAssistivePrompt({
  action: 'GITHUB_CREATE_ISSUE',
  context: 'Bug report for login feature',
});
```

### 3. MCP Integration
Your agents already support MCP through the configuration:

```json
{
  "mcpServers": {
    "composio": {
      "url": "https://mcp.composio.dev",
      "apiKey": "your-api-key"
    }
  }
}
```

## 📊 Toolkit Updates

### Recently Updated Toolkits

1. **GitHub** - Enhanced file operations
2. **Gmail** - Improved attachment handling
3. **Slack** - Better message formatting
4. **Linear** - Issue management improvements
5. **Notion** - Database operations enhanced

### Deprecated Toolkits
Some empty/unused toolkits removed (Dec 2025):
- Check official docs for full list
- Your active toolkits (GitHub, Gmail) unaffected

## 🔐 Security Updates

### Enhanced Masking (Dec 10, 2025)
Sensitive fields automatically masked in responses:
- API keys
- Tokens
- Passwords
- Client secrets

### MCP Security (Nov 13, 2025)
Required API key authentication for MCP URLs:
```javascript
// API key now required
const mcp = await composio.getMCP({
  apiKey: process.env.COMPOSIO_API_KEY,
});
```

## 🛠️ Troubleshooting

### "Tool not found" Error
**Cause**: Toolkit version mismatch

**Solution**:
```javascript
// Specify toolkit version
const tools = await composio.tools.get('default', {
  toolkits: ['GITHUB'],
  version: 'latest', // or specific version
});
```

### "Authentication failed" Error
**Cause**: Connected account expired or inactive

**Solution**:
1. Visit https://platform.composio.dev/apps
2. Reconnect the integration
3. Verify account is ACTIVE

### "Schema validation failed" Error
**Cause**: Optional field handling changed

**Solution**:
```javascript
// Optional fields now properly handled
const result = await composio.executeAction({
  action: 'GITHUB_CREATE_ISSUE',
  params: {
    title: 'Required field',
    body: 'Optional field', // Can be omitted
    // assignees: [], // Optional, can be omitted
  },
});
```

## 📚 Resources

### Official Documentation
- **Changelog**: https://docs.composio.dev/docs/changelog
- **Migration Guide**: https://docs.composio.dev/docs/migration
- **API Reference**: https://docs.composio.dev/api-reference
- **SDK Docs**: https://docs.composio.dev/sdk

### Platform
- **Dashboard**: https://platform.composio.dev
- **Apps**: https://platform.composio.dev/apps
- **Settings**: https://platform.composio.dev/settings

### Support
- **Discord**: https://discord.gg/composio
- **GitHub**: https://github.com/composiohq/composio
- **Email**: support@composio.dev

## 🎯 Best Practices

1. **Keep SDK Updated**
   ```bash
   pnpm update @composio/core @composio/langchain
   ```

2. **Use Tool Router**
   - Enable for automatic tool selection
   - Reduces manual tool mapping

3. **Monitor Connected Accounts**
   - Check expiration dates
   - Reconnect before expiry

4. **Handle Errors Gracefully**
   ```javascript
   try {
     const result = await composio.executeAction({...});
   } catch (error) {
     if (error.code === 'ACCOUNT_EXPIRED') {
       // Prompt user to reconnect
     }
   }
   ```

5. **Use Latest Toolkit Versions**
   - Specify `version: 'latest'`
   - Check changelog for updates

## 🔄 Update Checklist

- [x] SDK updated to 0.6.x
- [x] Imports using `@composio/core`
- [x] Provider properly initialized
- [x] Tool fetching syntax updated
- [x] Error handling implemented
- [ ] Tool Router enabled (optional)
- [ ] Assistive Prompts tested (experimental)
- [ ] Connected accounts verified

## 🚨 Important Notes

- **Breaking Changes**: SDK 0.6.0 has breaking changes
- **Migration Required**: Update imports and initialization
- **Toolkit Versions**: Some toolkits deprecated
- **Security**: Enhanced masking for sensitive data
- **MCP**: API key now required for MCP URLs

---

**Your Composio integration is up-to-date and compatible with the latest SDK!**

For detailed changelog: https://docs.composio.dev/docs/changelog
