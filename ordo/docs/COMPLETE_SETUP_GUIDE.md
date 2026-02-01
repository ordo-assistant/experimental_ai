# 🚀 Complete Setup Guide - Ordo Multi-Agent System

## Overview

Panduan lengkap untuk setup dan konfigurasi Ordo, sistem multi-agent AI dengan akses ke 800+ toolkits, Web3, blockchain, dan 200+ AI models.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [API Keys Setup](#api-keys-setup)
4. [Agent Configuration](#agent-configuration)
5. [Running the System](#running-the-system)
6. [Testing Agents](#testing-agents)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## 🔧 Prerequisites

### Required Software

```bash
# Node.js 20+
node --version  # Should be v20.x.x or higher

# pnpm (package manager)
pnpm --version  # Should be 8.x.x or higher

# Git
git --version
```

### Install pnpm (if not installed)

```bash
npm install -g pnpm
```

---

## 📦 Installation

### Step 1: Clone Repository

```bash
cd C:\Users\raden\Documents\composio_agent
```

### Step 2: Install Dependencies

```bash
cd ordo
pnpm install
```

This will install all dependencies for:
- Main workspace
- Web app (`apps/web`)
- Agents (`apps/agents`)
- All submodules (solana-agent-kit, plugin-god-mode, etc.)

### Step 3: Verify Installation

```bash
# Check if langgraph CLI is installed
pnpm langgraph --version

# Should output: @langchain/langgraph-cli/x.x.x
```

---

## 🔑 API Keys Setup

### Already Configured ✅

Your `.env` file should have these keys:

```bash
# LangSmith (Tracing & Debugging)
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGSMITH_TRACING=true
LANGSMITH_PROJECT="Ordo-Ai"

# Composio (800+ Toolkits)
COMPOSIO_API_KEY=your_composio_api_key_here

# Cerebras (Fast LLM)
CEREBRAS_API_KEY=your_cerebras_api_key_here

# OpenRouter (200+ Models)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI (GPT)
OPENAI_API_KEY=your_openai_api_key_here

# Tavily (Web Search)
TAVILY_API_KEY=your_tavily_api_key_here

# Helius (Solana RPC)
HELIUS_API_KEY=your_helius_api_key_here
RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_helius_api_key_here

# Solana Wallet
SOLANA_PRIVATE_KEY=3paMMQ7xwYaoJyL4iFWKHmKag4p5peHDoU85zZmv5ZM9vUW23ns2aWSTBGbevAjmL4Dntruc7eXdwmZNS2f4BtJH

# Jupiter (DeFi)
JUPITER_API_KEY=40a97ca1-f337-49b5-9f82-49f95a13e217
```

### Optional Keys (Add if Needed)

If you need additional services, add these at the **bottom** of `.env`:

```bash
# Serper (Google Search)
SERPER_API_KEY=your_key_here

# Brave Search
BRAVE_SEARCH_API_KEY=your_key_here

# OKX DEX
OKX_API_KEY=your_key_here
OKX_SECRET_KEY=your_key_here

# Messari (Market Data)
MESSARI_API_KEY=your_key_here

# Lulo (Lending)
LULO_API_KEY=your_key_here
```

**IMPORTANT:** Never modify existing keys, only add new ones at the bottom!

---

## ⚙️ Agent Configuration

### Current Agents (12 Total)

Your `langgraph.json` is already configured with:

```json
{
  "graphs": {
    "simple_agent": "./apps/agents/src/simple-agent.js:app",
    "openrouter_agent": "./apps/agents/src/openrouter-agent.js:app",
    "openrouter_tools": "./apps/agents/src/openrouter-tools-agent.js:app",
    "tavily_agent": "./apps/agents/src/tavily-agent.js:app",
    "solana_agent": "./apps/agents/src/solana-agent.js:app",
    "web3_agent": "./apps/agents/src/web3-agent.js:app",
    "godmode_agent": "./apps/agents/src/godmode-agent.js:app",
    "ultimate_agent": "./apps/agents/src/ultimate-agent.js:app",
    "composio_meta": "./apps/agents/src/composio-meta-agent.js:app",
    "github_agent": "./apps/agents/src/composio-github-agent.js:app",
    "agent": "./apps/agents/src/react-agent/graph.ts:graph",
    "memory_agent": "./apps/agents/src/memory-agent/graph.ts:graph"
  }
}
```

### Agent Capabilities

| Agent | Tools | Status | Use Case |
|-------|-------|--------|----------|
| **simple_agent** | 0 | ✅ Ready | Basic chat |
| **composio_meta** | 5 meta | ✅ Ready | 800+ toolkits |
| **openrouter_agent** | 0 | ✅ Ready | 200+ models |
| **openrouter_tools** | 5 | ✅ Ready | Models + tools |
| **tavily_agent** | 2 | ✅ Ready | Web search |
| **solana_agent** | 3 | ✅ Ready | NFT queries |
| **web3_agent** | 60+ | ✅ Ready | DeFi operations |
| **godmode_agent** | 40+ | ✅ Ready | Advanced DeFi |
| **ultimate_agent** | 150+ | ✅ Ready | ALL tools |
| **github_agent** | 4 | ⚠️ Needs auth | GitHub ops |
| **agent** | Pre-built | ⚠️ Needs config | ReAct pattern |
| **memory_agent** | Pre-built | ⚠️ Needs config | Memory |

---

## 🚀 Running the System

### Step 1: Start Development Server

```bash
cd ordo
pnpm dev
```

Expected output:
```
🚀 Starting LangGraph server...
✅ Server running on http://localhost:2024
📊 Studio: https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```

### Step 2: Open LangGraph Studio

Visit: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

You should see:
- List of 12 agents
- Agent selection dropdown
- Chat interface
- Graph visualization

### Step 3: Select an Agent

Start with `simple_agent` (no setup required):
1. Click dropdown
2. Select "simple_agent"
3. Type a message
4. Press Enter

---

## 🧪 Testing Agents

### Test 1: Simple Agent (Basic Chat)

```
Agent: simple_agent
Query: "Tell me a joke about AI"
Expected: Joke response
```

### Test 2: Composio Meta (Tool Discovery)

```
Agent: composio_meta
Query: "What tools are available for GitHub?"
Expected: List of GitHub tools with descriptions
```

### Test 3: OpenRouter (Multiple Models)

```
Agent: openrouter_agent
Query: "Explain quantum computing in simple terms"
Expected: Explanation using selected model
```

### Test 4: Tavily (Web Search)

```
Agent: tavily_agent
Query: "Search for latest AI news"
Expected: Recent AI news articles
```

### Test 5: Solana (NFT Queries)

```
Agent: solana_agent
Query: "Get NFTs for wallet: 7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3"
Expected: List of NFTs owned by wallet
```

### Test 6: Web3 (DeFi Operations)

```
Agent: web3_agent
Query: "Get current price of SOL"
Expected: SOL price in USD
```

### Test 7: God Mode (Advanced DeFi)

```
Agent: godmode_agent
Query: "Get trending tokens on Solana"
Expected: List of trending tokens with metrics
```

### Test 8: Ultimate (ALL Tools)

```
Agent: ultimate_agent
Query: "What can you do?"
Expected: List of all 150+ capabilities
```

---

## 🔐 Authentication Setup

### GitHub Authentication (for github_agent)

1. Visit: https://platform.composio.dev/apps
2. Find "GitHub" in list
3. Click "Connect"
4. Authorize with GitHub
5. Return to Studio
6. Test: "Star repository composiohq/composio"

### Gmail Authentication (for composio_meta)

1. In Studio, select `composio_meta`
2. Query: "Send an email"
3. Agent will return auth URL
4. Visit URL and authorize
5. Return and retry query

### Multi-User Setup

For production with multiple users:

```javascript
// Create session per user
const session = await composio.create(userId);
const tools = await session.tools();

// Each user has isolated connections
```

See: [COMPOSIO_USERS_SESSIONS.md](./COMPOSIO_USERS_SESSIONS.md)

---

## 🐛 Troubleshooting

### Issue 1: Server Won't Start

**Error:** `Port 2024 already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :2024
taskkill /PID <PID> /F

# Then restart
pnpm dev
```

### Issue 2: Module Not Found

**Error:** `Cannot find module '@langchain/cerebras'`

**Solution:**
```bash
cd ordo
pnpm install
```

### Issue 3: API Key Invalid

**Error:** `Invalid API key`

**Solution:**
1. Check `.env` file
2. Verify key is correct
3. No extra spaces or quotes
4. Restart server after changes

### Issue 4: Tool Execution Failed

**Error:** `Tool execution failed: Authentication required`

**Solution:**
1. Visit https://platform.composio.dev/apps
2. Connect the required service
3. Retry in Studio

### Issue 5: Agent Not Found

**Error:** `Agent 'xxx' not found`

**Solution:**
1. Check `langgraph.json`
2. Verify agent path exists
3. Restart server

### Issue 6: Slow Response

**Cause:** Large tool set loading

**Solution:**
- Use `composio_meta` for dynamic loading
- Or specify exact tools needed:
```javascript
const tools = await composio.tools.get('default', [
  'GITHUB_CREATE_ISSUE',
  'GITHUB_STAR_REPOSITORY'
]);
```

---

## 📊 Monitoring & Debugging

### LangSmith Tracing

All agent executions are traced in LangSmith:

1. Visit: https://smith.langchain.com
2. Select project: "Ordo-Ai"
3. View traces, latency, costs

### Console Logs

Watch server console for:
- Tool executions
- API calls
- Errors
- Performance metrics

### Studio Visualization

LangGraph Studio shows:
- Agent graph structure
- Node execution order
- State transitions
- Tool calls

---

## 🎯 Next Steps

### Day 1: Basic Testing
- ✅ Test `simple_agent`
- ✅ Test `composio_meta`
- ✅ Test `openrouter_agent`

### Day 2: Authentication
- ✅ Connect GitHub
- ✅ Connect Gmail
- ✅ Test authenticated tools

### Day 3: Web3 Exploration
- ✅ Test `solana_agent`
- ✅ Test `web3_agent`
- ✅ Explore DeFi tools

### Day 4: Advanced Features
- ✅ Test `godmode_agent`
- ✅ Test `ultimate_agent`
- ✅ Bulk operations

### Day 5: Custom Development
- ✅ Create custom agent
- ✅ Add new tools
- ✅ Build workflows

---

## 📚 Documentation Index

### Core Guides
- **[README.md](./README.md)** - Project overview
- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - This file
- **[API_KEYS_CHECKLIST.md](./API_KEYS_CHECKLIST.md)** - Quick reference

### Composio Guides
- **[COMPOSIO_META_AGENT.md](./COMPOSIO_META_AGENT.md)** - 800+ toolkits
- **[COMPOSIO_USERS_SESSIONS.md](./COMPOSIO_USERS_SESSIONS.md)** - Multi-user
- **[COMPOSIO_AUTHENTICATION.md](./COMPOSIO_AUTHENTICATION.md)** - Auth flows
- **[COMPOSIO_TOOLKIT_MANAGEMENT.md](./COMPOSIO_TOOLKIT_MANAGEMENT.md)** - Toolkit control
- **[COMPOSIO_ADVANCED.md](./COMPOSIO_ADVANCED.md)** - Advanced config
- **[COMPOSIO_UPDATES.md](./COMPOSIO_UPDATES.md)** - SDK updates

### Agent Guides
- **[ULTIMATE_AGENT.md](./ULTIMATE_AGENT.md)** - 150+ tools
- **[GODMODE_SETUP.md](./GODMODE_SETUP.md)** - Advanced DeFi
- **[GODMODE_QUICKSTART.md](./GODMODE_QUICKSTART.md)** - Quick start
- **[WEB3_SETUP.md](./WEB3_SETUP.md)** - Blockchain setup
- **[OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md)** - 200+ models
- **[TAVILY_SETUP.md](./TAVILY_SETUP.md)** - Web search
- **[HELIUS_ADVANCED.md](./HELIUS_ADVANCED.md)** - Advanced Helius

### Multi-User
- **[MULTI_USER_GUIDE.md](./MULTI_USER_GUIDE.md)** - Production setup
- **[examples/README.md](./examples/README.md)** - Code examples

---

## 🎓 Learning Resources

### Official Documentation
- **LangGraph**: https://langchain-ai.github.io/langgraph/
- **LangChain**: https://js.langchain.com/docs/
- **Composio**: https://docs.composio.dev
- **Cerebras**: https://cerebras.ai/inference
- **OpenRouter**: https://openrouter.ai/docs

### Community
- **LangChain Discord**: https://discord.gg/langchain
- **Composio Discord**: https://discord.gg/composio
- **Solana Discord**: https://discord.gg/solana

### Tutorials
- **LangGraph Tutorial**: https://langchain-ai.github.io/langgraph/tutorials/
- **Composio Quickstart**: https://docs.composio.dev/quickstart
- **Solana Agent Kit**: https://github.com/sendaifun/solana-agent-kit

---

## 🔒 Security Best Practices

### API Keys
- ✅ Never commit `.env` to git
- ✅ Use environment variables
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/prod

### Wallets
- ✅ Use test wallets for development
- ✅ Start on devnet before mainnet
- ✅ Monitor all transactions
- ✅ Set spending limits

### Multi-User
- ✅ Use user-specific sessions
- ✅ Never use 'default' in production
- ✅ Isolate user data
- ✅ Implement rate limiting

---

## 📞 Support

### Issues
- **GitHub**: Create issue in repository
- **Discord**: Join community servers
- **Email**: Contact maintainers

### Resources
- **Studio**: https://smith.langchain.com/studio?baseUrl=http://localhost:2024
- **Platform**: https://platform.composio.dev
- **Dashboard**: https://smith.langchain.com

---

## 🎉 Summary

You now have:

- ✅ 12 agents configured
- ✅ 800+ toolkits available (Composio)
- ✅ 200+ AI models (OpenRouter)
- ✅ 150+ Web3 tools (Ultimate Agent)
- ✅ Web search (Tavily)
- ✅ NFT queries (Helius)
- ✅ DeFi operations (God Mode)
- ✅ Development server running
- ✅ LangSmith tracing enabled
- ✅ Studio UI ready

**Start building!** 🚀

```bash
cd ordo
pnpm dev
```

Open: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

---

**Questions?** Check the documentation or ask in Discord!
