# 🚀 Get Started - Ordo Multi-Agent System

## Quick Start (5 Minutes)

### Step 1: Start Server

```bash
cd ordo
pnpm dev
```

### Step 2: Open Studio

Visit: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

### Step 3: Test Simple Agent

1. Select `simple_agent` from dropdown
2. Type: "Tell me a joke about AI"
3. Press Enter
4. See response!

**✅ You're ready!**

---

## 🎯 What's New

### TypeScript Migration ✨

We're migrating to TypeScript for production-ready code:

**Completed:**
- ✅ `simple_agent` - Now TypeScript!
- ✅ `composio_meta` - Now TypeScript!
- ✅ Shared utilities (`lib/`)
- ✅ Configuration management
- ✅ Logger system
- ✅ Type definitions

**Benefits:**
- Type safety
- Better IDE support
- Compile-time error checking
- Professional code structure

### New Folder Structure 📁

```
apps/agents/src/
├── agents/              # ✨ NEW: Organized by category
│   ├── basic/           # Simple agents
│   ├── composio/        # Composio agents
│   ├── llm/             # LLM providers
│   ├── search/          # Search agents
│   └── web3/            # Blockchain agents
├── tools/               # ✨ NEW: Tool definitions
├── mcp/                 # ✨ NEW: MCP integrations
└── lib/                 # ✨ NEW: Shared utilities
```

See: [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)

---

## 📚 Your 12 Agents

### ✅ Production Ready (TypeScript)

1. **simple_agent** - Basic chat
   - Location: `agents/basic/simple.agent.ts`
   - Status: ✅ TypeScript
   - Tools: None

2. **composio_meta** - 800+ toolkits
   - Location: `agents/composio/meta.agent.ts`
   - Status: ✅ TypeScript
   - Tools: 5 meta tools

### ⏳ Migration In Progress

3. **openrouter_agent** - 200+ models
4. **openrouter_tools** - Models + tools
5. **tavily_agent** - Web search
6. **solana_agent** - NFT queries
7. **web3_agent** - 60+ Solana tools
8. **godmode_agent** - 40+ DeFi tools
9. **ultimate_agent** - 150+ ALL tools
10. **github_agent** - GitHub operations
11. **agent** - Pre-built ReAct
12. **memory_agent** - Conversation memory

---

## 🎓 Learning Path

### Day 1: Basics
```
1. Test simple_agent
2. Test composio_meta
3. Explore Studio UI
```

### Day 2: Tools
```
1. Test openrouter_agent (200+ models)
2. Test tavily_agent (web search)
3. Try different queries
```

### Day 3: Web3
```
1. Test solana_agent (NFTs)
2. Test web3_agent (DeFi)
3. Explore blockchain tools
```

### Day 4: Advanced
```
1. Test godmode_agent (Advanced DeFi)
2. Test ultimate_agent (ALL tools)
3. Build custom workflows
```

### Day 5: Build
```
1. Create custom agent
2. Add new tools
3. Deploy to production
```

---

## 💡 Example Queries

### Simple Agent
```
"Tell me a joke about AI"
"Explain quantum computing"
"What is the meaning of life?"
```

### Composio Meta (800+ Toolkits)
```
"What tools are available for GitHub?"
"Search for tools to send emails"
"Create a GitHub issue for bug XYZ"
"Send an email via Gmail"
```

### OpenRouter (200+ Models)
```
"Explain blockchain using DeepSeek"
"Write a poem using Claude"
"Summarize this text using GPT-4"
```

### Tavily (Web Search)
```
"Search for latest AI news"
"What's trending in blockchain?"
"Find information about Solana"
```

### Web3 Agents
```
"Get NFTs for wallet: [address]"
"Swap 1 SOL for USDC"
"Get current price of SOL"
"Get trending tokens on Solana"
```

---

## 📖 Documentation

### Setup Guides
- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - Full setup
- **[API_KEYS_CHECKLIST.md](./API_KEYS_CHECKLIST.md)** - API keys
- **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - Project structure
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - TypeScript migration

### Composio Guides
- **[COMPOSIO_META_AGENT.md](./COMPOSIO_META_AGENT.md)** - 800+ toolkits
- **[COMPOSIO_USERS_SESSIONS.md](./COMPOSIO_USERS_SESSIONS.md)** - Multi-user
- **[COMPOSIO_AUTHENTICATION.md](./COMPOSIO_AUTHENTICATION.md)** - Auth flows
- **[COMPOSIO_TOOLKIT_MANAGEMENT.md](./COMPOSIO_TOOLKIT_MANAGEMENT.md)** - Toolkit control
- **[COMPOSIO_ADVANCED.md](./COMPOSIO_ADVANCED.md)** - Advanced config

### Agent Guides
- **[ULTIMATE_AGENT.md](./ULTIMATE_AGENT.md)** - 150+ tools
- **[GODMODE_SETUP.md](./GODMODE_SETUP.md)** - Advanced DeFi
- **[WEB3_SETUP.md](./WEB3_SETUP.md)** - Blockchain
- **[OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md)** - 200+ models
- **[TAVILY_SETUP.md](./TAVILY_SETUP.md)** - Web search
- **[HELIUS_ADVANCED.md](./HELIUS_ADVANCED.md)** - Advanced Helius

### Multi-User
- **[MULTI_USER_GUIDE.md](./MULTI_USER_GUIDE.md)** - Production setup

---

## 🔧 Development

### Run Server
```bash
cd ordo
pnpm dev
```

### Build for Production
```bash
cd ordo
pnpm build
```

### Run Tests
```bash
cd ordo
pnpm test
```

### Lint Code
```bash
cd ordo
pnpm lint
```

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Kill process on port 2024
netstat -ano | findstr :2024
taskkill /PID <PID> /F

# Restart
pnpm dev
```

### Module Not Found
```bash
# Reinstall dependencies
cd ordo
pnpm install
```

### Agent Not Working
1. Check `langgraph.json` for correct path
2. Verify `.env` has required API keys
3. Restart server
4. Check console for errors

---

## 📊 Project Status

### Migration Progress
- **Completed:** 2/12 agents (17%)
- **In Progress:** TypeScript conversion
- **Next:** Remaining 10 agents

### Infrastructure
- ✅ Folder structure
- ✅ TypeScript setup
- ✅ Shared utilities
- ✅ Configuration management
- ✅ Logger system
- ✅ Type definitions

### Documentation
- ✅ 20+ guides created
- ✅ Migration guide
- ✅ Folder structure guide
- ✅ Complete setup guide

---

## 🎯 Next Steps

### For Users
1. Test migrated agents
2. Provide feedback
3. Report issues
4. Suggest improvements

### For Developers
1. Continue TypeScript migration
2. Organize tools
3. Set up MCP integrations
4. Update documentation

---

## 📞 Support

### Resources
- **Studio**: https://smith.langchain.com/studio?baseUrl=http://localhost:2024
- **LangSmith**: https://smith.langchain.com
- **Composio**: https://platform.composio.dev

### Community
- **LangChain Discord**: https://discord.gg/langchain
- **Composio Discord**: https://discord.gg/composio

---

## 🎉 Summary

**Ordo** is a production-ready multi-agent AI system with:

- ✅ 12 specialized agents
- ✅ 800+ toolkits (Composio)
- ✅ 200+ AI models (OpenRouter)
- ✅ 150+ Web3 tools (Ultimate Agent)
- ✅ TypeScript for production
- ✅ Organized folder structure
- ✅ Comprehensive documentation
- ✅ Professional code quality

**Ready to build?** 🚀

```bash
cd ordo
pnpm dev
```

Open: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

---

**Welcome to Ordo!** 🎯
