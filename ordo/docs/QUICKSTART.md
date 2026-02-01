# Quick Start Guide

## Issues Found

1. **Web UI Error**: System resource limitation on Windows
2. **Composio Error**: GitHub toolkit authentication issue

## Solutions

### Option 1: Use LangGraph Studio Only (Recommended)

Skip the web UI and use LangGraph Studio directly:

```bash
cd ordo/apps/agents
pnpm langgraph dev --port 2024 --config ../../langgraph.json
```

Then open: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

### Option 2: Use Simple Agent (No Composio)

I've created a simple Cerebras agent without Composio tools:

```bash
pnpm dev
```

Select `simple_agent` in the UI - it works without external tool dependencies.

### Option 3: Fix Composio Authentication

The Composio GitHub toolkit needs proper setup:

1. **Connect GitHub to Composio**:
   - Visit: https://platform.composio.dev/apps
   - Connect your GitHub account
   - Authorize the integration

2. **Update agents** to use connected account:
   ```javascript
   const tools = await composio.tools.get('your_entity_id', 'GITHUB');
   ```

3. **Restart**:
   ```bash
   pnpm dev
   ```

## Recommended Workflow

**For Development:**
```bash
# Terminal 1: Start LangGraph server only
cd ordo/apps/agents
pnpm langgraph dev --port 2024 --config ../../langgraph.json

# Use Studio UI
# Open: https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```

**For Testing:**
```bash
# Use the simple agent
pnpm dev
# Select "simple_agent" in UI
```

## Available Agents

- ✅ `simple_agent` - Works without external dependencies
- ✅ `agent` - Pre-built ReAct agent
- ✅ `memory_agent` - Pre-built memory agent
- ⚠️ `cerebras_agent` - Needs Composio GitHub setup
- ⚠️ `multi_agent` - Needs Composio GitHub + Gmail setup

## Next Steps

1. Test with `simple_agent` first
2. Set up Composio integrations if needed
3. Use LangGraph Studio for debugging
