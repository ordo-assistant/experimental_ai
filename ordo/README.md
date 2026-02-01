# Ordo - Advanced Multi-Agent AI System

A production-ready LangGraph-powered multi-agent system with Web3, blockchain, search, development capabilities, and access to 200+ AI models. Built with TypeScript for professional code quality.

## Quick Start

```bash
cd ordo
pnpm dev
```

Open Studio: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

## TypeScript Migration Complete

All agents have been migrated to TypeScript with professional clean code:

- Type safety and compile-time checks
- Better IDE support and auto-completion
- Professional folder structure
- Shared utilities and configuration
- Centralized logging and error handling

Progress: 10/10 agents migrated (100%)

See: [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) | [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)

## Hierarchical Multi-Agent System

Ordo implements a professional three-level hierarchy with multiple LLMs:

### Architecture

```
Level 1: Supervisor (GPT-4 Turbo)
    |
    +-- Level 2: Coordinators (Claude / Cerebras)
            |
            +-- Level 3: Workers (Specialized Agents)
```

### Benefits

- Optimal LLM selection per task level
- 50-80% cost savings vs single-LLM
- Fast routing and execution
- Scalable and maintainable

See: [HIERARCHICAL_SYSTEM.md](./HIERARCHICAL_SYSTEM.md)

## Your 17 AI Agents

### Hierarchical Agents (3)

| Agent | Level | LLM | Description |
|-------|-------|-----|-------------|
| supervisor | 1 | GPT-4 | Routes to coordinators |
| composio_coordinator | 2 | Claude | Manages Composio workers |
| web3_coordinator | 2 | Cerebras | Manages Web3 workers |

### Specialized Agents (10)

| Agent | Category | Language | Description |
|-------|----------|----------|-------------|
| simple_agent | Basic | TypeScript | Basic AI chat |
| composio_meta | Composio | TypeScript | 800+ toolkits |
| github_agent | Composio | TypeScript | GitHub operations |
| openrouter_agent | LLM | TypeScript | 200+ models |
| openrouter_tools | LLM | TypeScript | Models with tools |
| tavily_agent | Search | TypeScript | Web search |
| solana_agent | Web3 | TypeScript | NFT queries |
| web3_agent | Web3 | TypeScript | Solana DeFi |
| godmode_agent | Web3 | TypeScript | Advanced DeFi |
| ultimate_agent | Web3 | TypeScript | All tools |

### Pre-built Agents (4)

| Agent | Pattern | Description |
|-------|---------|-------------|
| agent | ReAct | Reasoning and acting |
| memory_agent | Memory | Conversation memory |
| research_agent | Research | Research tasks |
| retrieval_agent | RAG | Retrieval augmented |

## 🌟 Featured Agents

### Composio Meta Agent 🎯 (NEW!)
**800+ toolkits** - Dynamic access to ANY service:
- **5 Meta Tools**: Search, Auth, Execute, Workbench, Bash
- **Dynamic Discovery**: Find tools at runtime
- **Auto Authentication**: Handle OAuth automatically
- **Parallel Execution**: Run 20 tools simultaneously
- **Bulk Operations**: Python workbench for large tasks
- **All Services**: GitHub, Gmail, Slack, Jira, Salesforce, and 795+ more!

### Ultimate Agent 🚀
**150+ tools** - The MOST POWERFUL agent combining ALL plugins:
- **DeFi**: 50+ tools (Jupiter, Raydium, Orca, Drift, Lulo, Kamino)
- **NFT**: 15+ tools (Metaplex, Tensor, Magic Eden, 3Land)
- **Token**: 30+ tools (Pumpfun, Pyth, Rugcheck, Dexscreener)
- **Blinks**: Solana Actions & Blinks
- **God Mode**: 40+ advanced tools
- **Cross-Chain**: deBridge, Mayan
- **Everything**: All protocols, all features!

### OpenRouter Agents
Access **200+ AI models** with one API key:
- **Free models**: DeepSeek, Llama, Mistral, Gemma
- **Paid models**: GPT-4, Claude, Gemini, and more
- **Automatic fallbacks**: Switch models seamlessly

### God Mode Agent 🎮
**40+ Advanced DeFi tools** for ultimate Solana control:
- **Trading**: Jupiter swaps, DCA, Limit Orders
- **Lending**: Lulo, Kamino APY
- **Market Intel**: Birdeye, trending tokens
- **Safety**: Rugcheck analysis
- **Staking**: Sanctum LST
- **Launch**: Meteora token launches
- **Prediction**: Polymarket trading
- **NFT**: Crossmint commerce
- **Bridge**: deBridge cross-chain

### Web3 Agent
**60+ Solana actions** for complete DeFi operations:
- Token operations, NFT management
- DeFi trading, Perpetuals, Lending
- Cross-chain bridges, Market data

## Documentation

### Pre-built Agents
- [PREBUILT_AGENTS.md](./PREBUILT_AGENTS.md) - Pre-built agent patterns

### Project Structure
- [FINAL_STRUCTURE.md](./FINAL_STRUCTURE.md) - Complete folder organization

### Hierarchical System
- [HIERARCHICAL_SYSTEM.md](./HIERARCHICAL_SYSTEM.md) - Multi-level agent architecture

### Migration & Setup
- [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) - Migration completion report
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Project structure
- [GET_STARTED.md](./GET_STARTED.md) - Quick start guide
- [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) - Complete setup
- [API_KEYS_CHECKLIST.md](./API_KEYS_CHECKLIST.md) - Quick reference

### Setup & Configuration
- [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) - Complete setup
- [API_KEYS_CHECKLIST.md](./API_KEYS_CHECKLIST.md) - Quick reference

### Composio Integration
- [COMPOSIO_META_AGENT.md](./COMPOSIO_META_AGENT.md) - 800+ toolkits access
- [COMPOSIO_USERS_SESSIONS.md](./COMPOSIO_USERS_SESSIONS.md) - Multi-user sessions
- [COMPOSIO_AUTHENTICATION.md](./COMPOSIO_AUTHENTICATION.md) - Auth guide
- [COMPOSIO_TOOLKIT_MANAGEMENT.md](./COMPOSIO_TOOLKIT_MANAGEMENT.md) - Toolkit control
- [COMPOSIO_ADVANCED.md](./COMPOSIO_ADVANCED.md) - Advanced configuration
- [COMPOSIO_UPDATES.md](./COMPOSIO_UPDATES.md) - SDK updates

### Agent Guides
- [ULTIMATE_AGENT.md](./ULTIMATE_AGENT.md) - 150+ tools combined
- [GODMODE_SETUP.md](./GODMODE_SETUP.md) - 40+ Advanced DeFi tools
- [GODMODE_QUICKSTART.md](./GODMODE_QUICKSTART.md) - Quick start
- [WEB3_SETUP.md](./WEB3_SETUP.md) - Blockchain details
- [OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md) - 200+ models access
- [TAVILY_SETUP.md](./TAVILY_SETUP.md) - Web search setup
- [HELIUS_ADVANCED.md](./HELIUS_ADVANCED.md) - Advanced Helius features

### Multi-User & Examples
- [MULTI_USER_GUIDE.md](./MULTI_USER_GUIDE.md) - Multi-user setup
- [examples/README.md](./examples/README.md) - Code examples

## 💡 Example Queries

### Simple Agent (Works Now!)
```
"Tell me a joke about AI"
"Explain quantum computing"
```

### OpenRouter Agent (200+ Models)
```
"What is the meaning of life?" (using DeepSeek free)
"Write a poem about AI" (using Claude)
"Explain blockchain" (using GPT-4)
```

### Tavily Agent (Web Search)
```
"Search for latest AI news"
"What's trending in blockchain?"
```

### Composio Meta Agent (800+ Services) 🎯
```
"What tools are available for GitHub?"
"Create a GitHub issue and send email notification"
"Post to Slack when PR is merged"
"Label all unread emails from boss@company.com"
"Create Jira ticket from GitHub issue"
```

### Ultimate Agent (ALL TOOLS!) 🚀
```
"Deploy NFT collection and list on Tensor"
"Create Raydium pool and add liquidity"
"Launch token on Pumpfun and create DCA"
"Open Drift perp position with stop loss"
"Lend on Lulo and stake on Sanctum"
"Bridge to Ethereum and swap on Jupiter"
```

### God Mode Agent (Ultimate DeFi) 🎮
```
"Get trending tokens on Solana"
"Create a DCA order to buy 10 USDC of SOL daily"
"Check if token [address] is safe with rugcheck"
"What's the current APY on Lulo?"
"Launch a new token on Meteora"
"Bridge 10 USDC to Ethereum"
```

### Web3 Agent (Advanced DeFi) 🌟
```
"Deploy a new SPL token"
"Swap 1 SOL for USDC"
"Stake 5 SOL"
"Get current price of SOL"
```

### GitHub Agent
```
"Star repository composiohq/composio"
"List repos for user langchain-ai"
```

## 🔑 API Keys Needed

### Already Configured ✅
- Composio (GitHub, Gmail, 500+ tools)
- Cerebras (Fast LLM inference)
- LangSmith (Tracing & debugging)

### Add These ⚠️

```bash
# Priority 1: Multiple Models (Free + Paid, 2 min)
OPENROUTER_API_KEY=sk-or-v1-your-key
# Get: https://openrouter.ai/keys

# Priority 2: Web Search (Free, 2 min)
TAVILY_API_KEY=tvly-your-key
# Get: https://app.tavily.com

# Priority 3: Basic Blockchain (Free, 2 min)
HELIUS_API_KEY=your-key
# Get: https://www.helius.dev

# Priority 4: Advanced Web3 (Free, 5 min)
SOLANA_PRIVATE_KEY=your-base58-key
RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Pre-built Agents (Paid, 3 min)
ANTHROPIC_API_KEY=sk-ant-your-key
# Get: https://console.anthropic.com
```

## 🎯 Features

- ⚡ **Fast Inference** - Cerebras Llama 3.3 70B
- 🤖 **200+ Models** - OpenRouter integration
- 🔍 **Web Search** - Real-time via Tavily
- ⛓️ **Basic Blockchain** - NFT queries via Helius
- 🌟 **Advanced Web3** - 60+ Solana actions
- 🐙 **GitHub Integration** - 500+ tools via Composio
- 🎨 **Visual Debugging** - LangGraph Studio
- 💾 **Stateful** - Built-in conversation memory

## 📊 Model Comparison

| Provider | Models | Cost | Speed | Quality |
|----------|--------|------|-------|---------|
| Cerebras | Llama 3.3 70B | Free* | ⚡⚡⚡ | ⭐⭐⭐ |
| OpenRouter Free | 10+ models | Free | ⚡⚡ | ⭐⭐ |
| OpenRouter Paid | 200+ models | Varies | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| Anthropic | Claude | Paid | ⚡⚡ | ⭐⭐⭐⭐⭐ |

*Already have API key

## 🚨 Security

- Never commit `.env` to git
- Use test wallets for development
- Start on devnet before mainnet
- Monitor all transactions

## 📞 Support

- **Studio**: https://smith.langchain.com/studio?baseUrl=http://localhost:2024
- **OpenRouter**: https://openrouter.ai
- **Composio**: https://platform.composio.dev
- **Tavily**: https://app.tavily.com
- **Helius**: https://www.helius.dev

## 🎓 Learning Path

1. **Start**: Test `simple_agent` (works now!)
2. **Models**: Add OpenRouter for 200+ models
3. **Search**: Add Tavily for web search
4. **Blockchain**: Add Helius for NFT data
5. **DeFi**: Set up Web3 agent for trading
6. **Build**: Create custom agents

---

**Ready?** Open Studio and start with `simple_agent`:

https://smith.langchain.com/studio?baseUrl=http://localhost:2024
