# 🎮 God Mode Agent - Quick Start

## What is God Mode Agent?

The **most powerful DeFi agent** in Ordo with **40+ advanced tools** from plugin-god-mode.

## 🚀 3-Step Setup

### Step 1: Add Solana Private Key

Edit `ordo/.env`:

```bash
# Add your Solana wallet private key (base58 format)
SOLANA_PRIVATE_KEY=your-base58-private-key-here
```

**Don't have a wallet?** Generate one:
```bash
# Using Solana CLI
solana-keygen new

# Or use an existing wallet
```

### Step 2: Start Server

```bash
cd ordo
pnpm dev
```

### Step 3: Open Studio

```
https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```

Select: **godmode_agent**

## 💡 Try These First

### Safe Queries (No Transactions)
```
"Get trending tokens on Solana"
"Show my wallet balance"
"What's the current SOL price?"
"Get information about token SOL"
```

### Market Intelligence
```
"What are the top performing tokens today?"
"Show me trending tokens"
"Get token data for BONK"
```

### Safety Check
```
"Check if token [address] is safe"
"Run rugcheck on [token-address]"
```

### Portfolio
```
"Show my complete portfolio"
"What's my SOL balance?"
"Get my wallet address"
```

## 🎯 What Can God Mode Do?

### 🔥 Top Features

1. **Advanced Trading** (Jupiter)
   - DCA (Dollar Cost Averaging)
   - Limit Orders
   - Best rate swaps

2. **Market Intelligence** (Birdeye)
   - Trending tokens
   - Token analytics
   - Price tracking

3. **Safety Analysis** (Rugcheck)
   - Token safety checks
   - Rug pull detection

4. **Lending** (Lulo, Kamino)
   - Earn interest
   - Check APY rates
   - Withdraw earnings

5. **Staking** (Sanctum)
   - LST staking
   - APY comparison
   - Top performers

6. **Token Launch** (Meteora)
   - Launch new tokens
   - Claim creator fees

7. **Prediction Markets** (Polymarket)
   - List markets
   - Place bets
   - View order books

8. **Cross-Chain** (deBridge)
   - Bridge tokens
   - Multi-chain support

9. **NFT Commerce** (Crossmint)
   - NFT checkout
   - Order management

10. **Portfolio Management**
    - Complete overview
    - Transaction history
    - Multi-token support

## 📊 40+ Tools Available

| Category | Count | Examples |
|----------|-------|----------|
| Trading | 10+ | Buy, sell, DCA, limit orders |
| Lending | 4 | Lend, withdraw, APY |
| Market Data | 5 | Prices, trending, analytics |
| Portfolio | 8 | Balance, transfers, history |
| Safety | 1 | Rugcheck |
| Staking | 3 | LST, APY |
| Cross-Chain | 1 | Bridge |
| Token Launch | 2 | Launch, fees |
| NFT | 2 | Checkout, orders |
| Prediction | 4 | Markets, trades |

## 🆚 God Mode vs Web3 Agent

| Feature | web3_agent | godmode_agent |
|---------|------------|---------------|
| Basic Trading | ✅ | ✅ |
| DCA Orders | ❌ | ✅ |
| Limit Orders | ❌ | ✅ |
| Rugcheck | ❌ | ✅ |
| Token Launch | ❌ | ✅ |
| Prediction Markets | ❌ | ✅ |
| Market Intelligence | ❌ | ✅ |
| **Best For** | General DeFi | Advanced Strategies |

## 💰 Costs

### Free
- Market data queries
- Portfolio views
- Price checks
- Safety analysis

### Transaction Fees (SOL)
- Transfers: ~0.000005 SOL
- Swaps: ~0.0001 SOL
- DCA/Limit Orders: ~0.001 SOL
- Token Launch: ~0.1-1 SOL

## 🛡️ Safety Tips

### ✅ Do
- Start with small amounts
- Test on devnet first
- Check rugcheck before buying
- Monitor transactions
- Keep private keys secure

### ❌ Don't
- Use main wallet initially
- Skip safety checks
- Test with large amounts
- Share private keys
- Commit .env to git

## 🧪 Testing Workflow

### 1. Safe Queries (Start Here)
```
"Get trending tokens"
"Show my balance"
"What's SOL price?"
```

### 2. Safety Checks
```
"Check if token [address] is safe"
"Run rugcheck on BONK"
```

### 3. Small Transactions (Devnet)
```
"Transfer 0.01 SOL to [address]"
"Buy 0.1 USDC worth of SOL"
```

### 4. Advanced Features
```
"Create DCA order for 1 USDC daily"
"Set limit order to buy SOL at $100"
"What's the APY on Lulo?"
```

## 📚 Example Queries by Category

### Trading
```
"Get current price of SOL"
"Buy 1 SOL worth of USDC"
"Sell 100 USDC for SOL"
"Create a DCA order to buy 10 USDC of SOL daily"
"Create a limit order to buy SOL at $95"
"Show my active DCA orders"
"Cancel limit order [order-id]"
```

### Lending
```
"What's the current APY on Lulo?"
"Lend 100 USDC on Lulo"
"Get my Lulo balance"
"Withdraw 50 USDC from Lulo"
"Compare APY rates on Kamino"
```

### Market Intelligence
```
"Get trending tokens on Solana"
"Show me information about token BONK"
"What are the top performing tokens?"
"Get token data by ticker SOL"
```

### Safety
```
"Check if token [mint-address] is safe"
"Run rugcheck on [token-address]"
"Analyze token safety for BONK"
```

### Staking
```
"What are the top LST tokens?"
"Get APY for Sanctum LST"
"Show me best staking options"
"Compare LST performance"
```

### Portfolio
```
"Show my complete portfolio"
"What's my SOL balance?"
"Get my wallet address"
"Show transaction history"
"Transfer 1 SOL to [address]"
"Send 100 USDC to [address]"
```

### Token Launch
```
"Launch a new token on Meteora"
"Claim my creator fees from Meteora"
```

### Prediction Markets
```
"List available markets on Polymarket"
"Get order book for [market-id]"
"Place a bet on [market]"
"Show my trades on Polymarket"
```

### Cross-Chain
```
"Bridge 10 USDC from Solana to Ethereum"
"What are the bridge fees?"
```

## 🐛 Troubleshooting

### "Failed to initialize"
- Check `SOLANA_PRIVATE_KEY` in .env
- Verify private key format (base58)
- Restart server

### "Insufficient funds"
- Check wallet balance
- Fund wallet with SOL
- Reduce amount

### "Tool not found"
- Restart server
- Check plugin-god-mode installed
- Verify dependencies

## 📖 Full Documentation

For complete guide, see: **[GODMODE_SETUP.md](./GODMODE_SETUP.md)**

## 🎓 Learning Path

### Day 1: Explore
- Market data queries
- Portfolio views
- Safety checks

### Day 2: Trade
- Small swaps
- DCA orders
- Limit orders

### Day 3: Advanced
- Lending protocols
- Token launches
- Prediction markets

## 🚀 Ready to Start?

1. ✅ Add `SOLANA_PRIVATE_KEY` to `.env`
2. ✅ Run `pnpm dev`
3. ✅ Open Studio
4. ✅ Select `godmode_agent`
5. ✅ Try: "Get trending tokens on Solana"

---

**God Mode Agent is ready!** 🎮

Open Studio now:
```
https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```
