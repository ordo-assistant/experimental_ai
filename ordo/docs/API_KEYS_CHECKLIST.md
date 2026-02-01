# API Keys Checklist

## ✅ Already Configured

- [x] **COMPOSIO_API_KEY** - GitHub, Gmail, 500+ integrations
- [x] **CEREBRAS_API_KEY** - Fast LLM inference
- [x] **LANGSMITH_API_KEY** - Tracing and debugging

## ⚠️ Need to Add

### Priority 1: Get These First

- [ ] **TAVILY_API_KEY**
  - **Get it:** https://app.tavily.com
  - **Free tier:** 1,000 requests/month
  - **Enables:** `tavily_agent` - Web search & content extraction
  - **Add to .env:** `TAVILY_API_KEY=tvly-your-key`

- [ ] **HELIUS_API_KEY**
  - **Get it:** https://www.helius.dev
  - **Free tier:** 100,000 requests/month
  - **Enables:** `solana_agent` - NFT queries, wallet analysis
  - **Add to .env:** `HELIUS_API_KEY=your-key`

### Priority 2: Optional but Recommended

- [ ] **ANTHROPIC_API_KEY**
  - **Get it:** https://console.anthropic.com/settings/keys
  - **Pricing:** Pay-as-you-go (~$3 per million tokens)
  - **Enables:** `agent`, `memory_agent` pre-built agents
  - **Add to .env:** `ANTHROPIC_API_KEY=sk-ant-your-key`

### Priority 3: Setup Required

- [ ] **Composio GitHub Connection**
  - **Setup:** https://platform.composio.dev/apps
  - **Steps:**
    1. Click "Connect" on GitHub
    2. Authorize the integration
    3. Done! Your existing API key works
  - **Enables:** `github_agent` - Repository management

## 🎯 Quick Setup Commands

```bash
# 1. Edit .env file
code ordo/.env

# 2. Add your keys:
TAVILY_API_KEY=tvly-your-key-here
HELIUS_API_KEY=your-helius-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here

# 3. Restart server
cd ordo
pnpm dev
```

## 🚀 Test Each Agent

### After Adding Tavily Key
```bash
# Open Studio
https://smith.langchain.com/studio?baseUrl=http://localhost:2024

# Select: tavily_agent
# Try: "Search for latest AI news"
```

### After Adding Helius Key
```bash
# Select: solana_agent
# Try: "Get balance of [wallet-address]"
```

### After Connecting GitHub
```bash
# Select: github_agent
# Try: "Star the repository composiohq/composio"
```

## 📊 What Works Right Now

| Agent | Status | Requires |
|-------|--------|----------|
| simple_agent | ✅ Ready | Nothing! |
| tavily_agent | ⚠️ Needs key | Tavily API key |
| solana_agent | ⚠️ Needs key | Helius API key |
| github_agent | ⚠️ Needs setup | GitHub connection |
| agent | ⚠️ Needs key | Anthropic API key |
| memory_agent | ⚠️ Needs key | Anthropic API key |

## 💰 Cost Breakdown

### Free Tiers
- **Tavily:** 1,000 searches/month
- **Helius:** 100,000 requests/month
- **Composio:** Generous free tier
- **Cerebras:** Already have key
- **LangSmith:** Free tier available

### Paid (Optional)
- **Anthropic:** ~$3 per million tokens
- **Tavily Pro:** $100/month for unlimited
- **Helius Pro:** Custom pricing

## ⏱️ Time to Setup

- **Tavily:** 2 minutes (sign up + copy key)
- **Helius:** 2 minutes (sign up + copy key)
- **Anthropic:** 3 minutes (sign up + add payment + copy key)
- **GitHub:** 1 minute (click connect + authorize)

**Total:** ~10 minutes to get everything working!

## 🎓 Recommended Order

1. ✅ **Test simple_agent** (works now!)
2. 🔍 **Add Tavily** (most useful for research)
3. ⛓️ **Add Helius** (if you need blockchain)
4. 🐙 **Connect GitHub** (if you need repo management)
5. 🤖 **Add Anthropic** (for pre-built agents)

---

**Start here:** Test `simple_agent` right now!
https://smith.langchain.com/studio?baseUrl=http://localhost:2024
