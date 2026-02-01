# 🎉 Ordo - Complete Multi-Agent System

## Your 7 Powerful AI Agents

| # | Agent | Status | Capabilities | Setup Time |
|---|-------|--------|--------------|------------|
| 1 | **simple_agent** | ✅ Ready | Basic AI chat | 0 min |
| 2 | **tavily_agent** | ⚠️ Setup | Web search & extraction | 2 min |
| 3 | **solana_agent** | ⚠️ Setup | NFT queries (Helius) | 2 min |
| 4 | **web3_agent** | ⚠️ Setup | 60+ Solana actions | 5 min |
| 5 | **github_agent** | ⚠️ Setup | Repository management | 1 min |
| 6 | **agent** | ⚠️ Setup | Pre-built ReAct | 3 min |
| 7 | **memory_agent** | ⚠️ Setup | Conversation memory | 3 min |

## 🚀 Quick Start (3 Steps)

### Step 1: Test Now ✅
```bash
# Already running!
https://smith.langchain.com/studio?baseUrl=http://localhost:2024
# Select: simple_agent
# Try: "Tell me a joke"
```

### Step 2: Add API Keys ⚠️

Edit `ordo/.env`:

```bash
# Priority 1: Web Search (2 min)
TAVILY_API_KEY=tvly-your-key  # https://app.tavily.com

# Priority 2: Basic Blockchain (2 min)
HELIUS_API_KEY=your-key  # https://www.helius.dev

# Priority 3: Advanced Web3 (5 min)
SOLANA_PRIVATE_KEY=your-base58-key  # Generate or use existing
RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Pre-built Agents (3 min)
ANTHROPIC_API_KEY=sk-ant-your-key  # https://console.anthropic.com

# Optional: GitHub Tools (1 min)
# Connect at: https://platform.composio.dev/apps
```

### Step 3: Restart & Test 🎯
```bash
# Stop (Ctrl+C) and restart
pnpm dev
```

## 📚 Documentation

- **[GET_STARTED.md](./GET_STARTED.md)** - Quick 3-step guide
- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - Full docs
- **[API_KEYS_CHECKLIST.md](./API_KEYS_CHECKLIST.md)** - Quick reference
- **[TAVILY_SETUP.md](./TAVILY_SETUP.md)** - Web search details
- **[WEB3_SETUP.md](./WEB3_SETUP.md)** - Blockchain details

## 🎯 What Each Agent Does

### 1. simple_agent (Works Now!)
**Basic AI chat - no setup needed**

Try:
- "Explain quantum computing"
- "Write a haiku about code"
- "Tell me a programming joke"

### 2. tavily_agent (Web Search)
**Real-time web search and content extraction**

Needs: Tavily API key (https://app.tavily.com)

Try:
- "Search for latest AI news"
- "What's trending in tech?"
- "Extract content from [url]"

### 3. solana_agent (Basic Blockchain)
**NFT queries and wallet analysis via Helius**

Needs: Helius API key (https://www.helius.dev)

Try:
- "Get NFTs for wallet [address]"
- "Show balance of [address]"
- "Get details for NFT [mint]"

### 4. web3_agent (Advanced Web3) 🌟
**60+ Solana actions - most powerful!**

Needs: Solana private key + RPC URL

Try:
- "Deploy a new SPL token"
- "Swap 1 SOL for USDC"
- "Create an NFT collection"
- "Stake 5 SOL"
- "Get current price of SOL"
- "Open perpetual trade on Drift"
- "Bridge tokens to Ethereum"

**Capabilities:**
- Token operations (deploy, transfer, stake)
- NFT management (create, mint, list)
- DeFi trading (Jupiter, Raydium, Orca)
- Perpetuals (Drift, Adrena)
- Lending (Lulo, Drift)
- Cross-chain bridges (Wormhole, deBridge)
- Market data (CoinGecko, Pyth, Allora)
- And 40+ more actions!

### 5. github_agent (Code Repos)
**Repository management via Composio**

Needs: GitHub connection (https://platform.composio.dev/apps)

Try:
- "Star repository composiohq/composio"
- "List repos for user langchain-ai"
- "Show open issues in [repo]"

### 6. agent (Pre-built)
**ReAct agent pattern**

Needs: Anthropic API key

### 7. memory_agent (Pre-built)
**Conversation memory**

Needs: Anthropic API key

## 🔑 API Keys Summary

### Already Have ✅
- Composio API key
- Cerebras API key
- LangSmith API key

### Need to Get ⚠️

| Service | Cost | Time | Priority | Get It |
|---------|------|------|----------|--------|
| **Tavily** | Free (1K/mo) | 2 min | High | https://app.tavily.com |
| **Helius** | Free (100K/mo) | 2 min | High | https://www.helius.dev |
| **Solana Wallet** | Free | 5 min | Medium | Generate new or use existing |
| **Anthropic** | Paid (~$3/M tokens) | 3 min | Low | https://console.anthropic.com |
| **GitHub** | Free | 1 min | Low | https://platform.composio.dev/apps |

## 💡 Recommended Path

### Day 1: Test & Search
1. ✅ Test `simple_agent` (works now!)
2. 🔍 Add Tavily → Use `tavily_agent` for web search
3. 📖 Read documentation

### Day 2: Basic Blockchain
1. ⛓️ Add Helius → Use `solana_agent` for NFT queries
2. 🎯 Test wallet lookups and NFT data

### Day 3: Advanced Web3
1. 🌟 Generate Solana wallet
2. 💰 Fund with small amount of SOL
3. 🚀 Use `web3_agent` for full DeFi capabilities

### Day 4: Expand
1. 🐙 Connect GitHub → Use `github_agent`
2. 🤖 Add Anthropic → Use pre-built agents
3. 🎨 Build custom agents

## 🛠️ Cloned Repositories

I've cloned these advanced Web3 tools to your project:

1. **solana-agent-kit** - 60+ Solana actions (ACTIVE)
2. **x402-mcp** - Payment protocol MCP
3. **devrel-mcp** - Developer relations tools
4. **solana-mcp** - Solana MCP server
5. **plugin-god-mode** - Advanced plugin system

Currently using: **solana-agent-kit** in `web3_agent`

## 📊 Feature Comparison

| Feature | simple | tavily | solana | web3 | github |
|---------|--------|--------|--------|------|--------|
| Chat | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web Search | ❌ | ✅ | ❌ | ❌ | ❌ |
| NFT Queries | ❌ | ❌ | ✅ | ✅ | ❌ |
| Token Ops | ❌ | ❌ | ❌ | ✅ | ❌ |
| DeFi Trading | ❌ | ❌ | ❌ | ✅ | ❌ |
| Perpetuals | ❌ | ❌ | ❌ | ✅ | ❌ |
| Lending | ❌ | ❌ | ❌ | ✅ | ❌ |
| Bridges | ❌ | ❌ | ❌ | ✅ | ❌ |
| GitHub | ❌ | ❌ | ❌ | ❌ | ✅ |
| Setup Time | 0 min | 2 min | 2 min | 5 min | 1 min |

## 🎓 Learning Path

### Beginner
1. Start with `simple_agent`
2. Add `tavily_agent` for search
3. Read documentation

### Intermediate
1. Add `solana_agent` for NFT data
2. Connect `github_agent`
3. Explore pre-built agents

### Advanced
1. Set up `web3_agent`
2. Test DeFi operations on devnet
3. Build custom multi-agent workflows
4. Deploy to production

## 🚨 Important Security Notes

- **Never commit `.env`** to git (already in `.gitignore`)
- **Use test wallets** for development
- **Start on devnet** before mainnet
- **Keep small amounts** in agent wallets
- **Monitor transactions** carefully
- **Review code** before executing

## 💰 Cost Estimates

### Free Tier
- Tavily: 1,000 searches/month
- Helius: 100,000 requests/month
- Composio: Generous free tier
- Cerebras: Already have key
- LangSmith: Free tier available

### Paid (Optional)
- Anthropic: ~$3 per million tokens
- Solana gas: ~0.000005 SOL per transaction
- Token deployments: ~0.01-0.1 SOL
- NFT minting: ~0.01 SOL
- DeFi operations: Variable fees

## 📞 Support & Resources

### Documentation
- LangGraph: https://langchain-ai.github.io/langgraph/
- Composio: https://docs.composio.dev
- Tavily: https://docs.tavily.com
- Helius: https://docs.helius.dev
- Solana Agent Kit: https://docs.sendai.fun
- Solana: https://docs.solana.com

### Get Help
- LangSmith: https://smith.langchain.com
- Composio Platform: https://platform.composio.dev
- Tavily App: https://app.tavily.com
- Helius Dashboard: https://www.helius.dev

## 🎯 Next Action

**Right now:** Open Studio and test `simple_agent`!

https://smith.langchain.com/studio?baseUrl=http://localhost:2024

**Then:** Follow the recommended path above to unlock more capabilities.

---

**Questions?** Check the documentation files or ask in Studio!
