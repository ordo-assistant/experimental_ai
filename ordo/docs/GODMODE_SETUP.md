# 🎮 God Mode Agent - Ultimate Solana DeFi Agent

## Overview

**God Mode Agent** adalah agent paling powerful di Ordo dengan **40+ advanced DeFi tools** dari plugin-god-mode. Agent ini menggabungkan semua kemampuan DeFi Solana dalam satu agent yang komprehensif.

## 🚀 Features

### 1. **Birdeye** - Market Intelligence
- `getToken` - Get detailed token information
- `getTrendingTokens` - Get trending tokens on Solana

### 2. **deBridge** - Cross-Chain Bridging
- `bridge` - Bridge tokens across different blockchains

### 3. **Jupiter** - Advanced Trading
- `fetchPrice` - Get real-time token prices
- `buy` - Buy tokens with best rates
- `sell` - Sell tokens with best rates
- `getTokenDataByTicker` - Get token data by ticker symbol

**DCA (Dollar Cost Averaging):**
- `createDCA` - Create DCA order
- `cancelDCA` - Cancel DCA order
- `getDCAOrders` - Get all DCA orders

**Limit Orders:**
- `createLO` - Create limit order
- `cancelLO` - Cancel limit order
- `getLOs` - Get all limit orders

### 4. **Lulo** - Lending Protocol
- `luloLend` - Lend tokens to earn interest
- `initiateLuloWithdraw` - Withdraw from Lulo
- `getLuloBalance` - Get Lulo balance
- `luloGetApy` - Get current APY rates

### 5. **Rugcheck** - Token Safety
- `rugcheck` - Analyze token for rug pull risks

### 6. **Sanctum** - LST Staking
- `sanctumGetLSTAPY` - Get LST APY rates
- `getTopLST` - Get top performing LSTs

### 7. **Kamino** - Lending Markets
- `getKaminoSupplyApy` - Get supply APY rates

### 8. **Meteora** - Token Launches
- `launchMeteoraToken` - Launch new token on Meteora
- `claimMeteoraCreatorFee` - Claim creator fees

### 9. **Crossmint** - NFT Commerce
- `checkout` - Create NFT checkout session
- `confirmOrder` - Confirm NFT order

### 10. **Polymarket** - Prediction Markets
- `listMarkets` - List available markets
- `getTrades` - Get trade history
- `placeOrder` - Place prediction market order
- `getOrderBook` - Get market order book

### 11. **Wallet** - Portfolio Management
- `getWalletAddress` - Get Solana wallet address
- `getEvmAddress` - Get EVM wallet address
- `getSolBalance` - Get SOL balance
- `getTokenBalance` - Get SPL token balance
- `getSolPrice` - Get current SOL price
- `getPortfolio` - Get complete portfolio
- `transfer` - Transfer SOL
- `transferSPL` - Transfer SPL tokens
- `getTransactionHistory` - Get transaction history
- `onramp` - Buy crypto with fiat

## 📋 Prerequisites

### Required API Keys

Add to `ordo/.env`:

```bash
# Solana (Required)
SOLANA_PRIVATE_KEY=your-base58-private-key
RPC_URL=https://api.mainnet-beta.solana.com

# Cerebras (Already configured)
CEREBRAS_API_KEY=csk-jw6jn9ytdrm3p4x5ffhw58tyf4f4ym5xx82jh9d86pm63xf9

# Optional for specific features
OPENAI_API_KEY=sk-proj-your-key  # For some advanced features
HELIUS_API_KEY=your-key           # For enhanced RPC
```

### Optional API Keys (for specific tools)

```bash
# Jupiter
JUPITER_API_URL=https://api.jup.ag/ultra
JUPITER_REFERRAL_ACCOUNT=your-referral-account
JUPITER_FEE_BPS=50

# Crossmint
CROSSMINT_API_KEY=your-key

# deBridge
DEBRIDGE_API_KEY=your-key

# Birdeye
BIRDEYE_API_KEY=your-key
```

## 🎯 Quick Start

### 1. Generate Solana Wallet (if needed)

```bash
# Using Solana CLI
solana-keygen new --outfile ~/.config/solana/godmode-wallet.json

# Get private key in base58
solana-keygen pubkey ~/.config/solana/godmode-wallet.json
```

Or use existing wallet private key.

### 2. Add to .env

```bash
# Add your Solana private key
SOLANA_PRIVATE_KEY=your-base58-private-key-here
```

### 3. Start Server

```bash
cd ordo
pnpm dev
```

### 4. Open Studio

```
https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```

Select: **godmode_agent**

## 💡 Example Queries

### Market Intelligence
```
"Get trending tokens on Solana"
"Show me information about token SOL"
"What are the top performing tokens today?"
```

### Trading
```
"Get current price of SOL"
"Buy 1 SOL worth of USDC"
"Sell 100 USDC for SOL"
"Create a DCA order to buy 10 USDC of SOL daily"
"Create a limit order to buy SOL at $100"
```

### Lending
```
"What's the current APY on Lulo?"
"Lend 100 USDC on Lulo"
"Get my Lulo balance"
"Withdraw 50 USDC from Lulo"
```

### Token Safety
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
```

### Portfolio
```
"Show my portfolio"
"What's my SOL balance?"
"Get my wallet address"
"Show transaction history"
```

### Cross-Chain
```
"Bridge 10 USDC from Solana to Ethereum"
"What are the bridge fees?"
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
```

### NFT Commerce
```
"Create checkout for NFT collection"
"Confirm order [order-id]"
```

## 🔧 Advanced Usage

### DCA (Dollar Cost Averaging)

```javascript
// Create DCA order
"Create a DCA order to buy 10 USDC worth of SOL every day for 30 days"

// Check DCA orders
"Show my active DCA orders"

// Cancel DCA
"Cancel DCA order [order-id]"
```

### Limit Orders

```javascript
// Create limit order
"Create a limit order to buy 1 SOL at $95"

// Check limit orders
"Show my active limit orders"

// Cancel limit order
"Cancel limit order [order-id]"
```

### Portfolio Management

```javascript
// Complete portfolio view
"Show my complete portfolio with all tokens and values"

// Transfer tokens
"Transfer 1 SOL to [recipient-address]"
"Send 100 USDC to [recipient-address]"

// Transaction history
"Show my last 10 transactions"
```

## 🛡️ Security Best Practices

### ✅ Do
- Use a dedicated wallet for the agent
- Start with small amounts for testing
- Test on devnet first
- Keep private keys secure
- Monitor transactions regularly
- Set spending limits
- Use hardware wallet for large amounts

### ❌ Don't
- Share your private key
- Use your main wallet
- Test with large amounts initially
- Commit `.env` to git
- Use on untrusted networks
- Skip transaction verification

## 📊 Tool Categories

| Category | Tools | Use Case |
|----------|-------|----------|
| **Trading** | 10+ | Buy, sell, DCA, limit orders |
| **Lending** | 4 | Lend, withdraw, check APY |
| **Market Data** | 5 | Prices, trending, token info |
| **Portfolio** | 8 | Balance, transfers, history |
| **Safety** | 1 | Rugcheck analysis |
| **Staking** | 3 | LST, APY, top performers |
| **Cross-Chain** | 1 | Bridge tokens |
| **Token Launch** | 2 | Launch, claim fees |
| **NFT** | 2 | Checkout, confirm orders |
| **Prediction** | 4 | Markets, trades, orders |

**Total: 40+ tools**

## 🔄 Comparison with Other Agents

| Feature | web3_agent | godmode_agent |
|---------|------------|---------------|
| Basic Trading | ✅ | ✅ |
| DCA Orders | ❌ | ✅ |
| Limit Orders | ❌ | ✅ |
| Lending (Lulo) | ✅ | ✅ |
| Rugcheck | ❌ | ✅ |
| LST Staking | ❌ | ✅ |
| Token Launch | ❌ | ✅ |
| Prediction Markets | ❌ | ✅ |
| NFT Commerce | ❌ | ✅ |
| Cross-Chain Bridge | ✅ | ✅ |
| Market Intelligence | ❌ | ✅ |
| **Total Tools** | 60+ | 40+ |

**Recommendation:**
- Use **web3_agent** for general Solana operations
- Use **godmode_agent** for advanced DeFi strategies

## 💰 Cost Estimates

### Transaction Fees
- SOL transfers: ~0.000005 SOL
- Token swaps: ~0.0001-0.001 SOL
- DCA creation: ~0.001 SOL
- Limit order: ~0.001 SOL
- Token launch: ~0.1-1 SOL

### API Costs
- Cerebras: Free (already have key)
- Jupiter: Free
- Lulo: Free
- Rugcheck: Free
- Most tools: Free

### Optional Services
- Crossmint: Variable fees
- deBridge: Bridge fees apply
- Polymarket: Trading fees

## 🧪 Testing

### Test on Devnet First

```bash
# Change RPC to devnet
RPC_URL=https://api.devnet.solana.com

# Get devnet SOL
solana airdrop 2 --url devnet

# Test agent
pnpm dev
```

### Test Queries

1. **Safe queries** (no transactions):
   - "Get trending tokens"
   - "Show my balance"
   - "Get SOL price"

2. **Small transactions** (devnet):
   - "Transfer 0.01 SOL to [address]"
   - "Buy 0.1 USDC worth of SOL"

3. **Advanced features** (devnet):
   - "Create DCA order for 1 USDC daily"
   - "Run rugcheck on [token]"

## 🐛 Troubleshooting

### "Failed to initialize God Mode Agent"
**Solution:**
- Check `SOLANA_PRIVATE_KEY` is set
- Verify private key format (base58)
- Ensure RPC URL is accessible

### "Insufficient funds"
**Solution:**
- Check wallet balance
- Fund wallet with SOL
- Reduce transaction amount

### "Tool not found"
**Solution:**
- Restart server
- Check plugin-god-mode is installed
- Verify all dependencies

### "RPC error"
**Solution:**
- Use Helius RPC for better reliability
- Check RPC_URL in .env
- Try different RPC endpoint

## 📚 Resources

### Documentation
- **Plugin God Mode**: `ordo/plugin-god-mode/README.md`
- **Solana Agent Kit**: https://docs.sendai.fun
- **Jupiter**: https://docs.jup.ag
- **Lulo**: https://docs.lulo.fi
- **Sanctum**: https://docs.sanctum.so
- **Meteora**: https://docs.meteora.ag

### Tools
- **Solana Explorer**: https://explorer.solana.com
- **Jupiter**: https://jup.ag
- **Birdeye**: https://birdeye.so
- **Rugcheck**: https://rugcheck.xyz

## 🎓 Learning Path

### Beginner
1. Start with portfolio queries
2. Check token prices
3. View transaction history
4. Test small transfers

### Intermediate
1. Execute token swaps
2. Use rugcheck for safety
3. Check lending APY
4. Create DCA orders

### Advanced
1. Launch tokens on Meteora
2. Use limit orders
3. Bridge cross-chain
4. Trade on Polymarket
5. Manage NFT commerce

## 🚀 Next Steps

1. ✅ Add `SOLANA_PRIVATE_KEY` to `.env`
2. ✅ Fund wallet with SOL
3. ✅ Start server: `pnpm dev`
4. ✅ Open Studio and select `godmode_agent`
5. ✅ Test with safe queries first
6. ✅ Gradually try advanced features

## ⚠️ Important Notes

- **Start small**: Test with small amounts first
- **Use devnet**: Test on devnet before mainnet
- **Monitor closely**: Watch all transactions
- **Keep secure**: Never share private keys
- **Backup wallet**: Save wallet backup safely
- **Check fees**: Understand transaction costs

---

**God Mode Agent is ready!** 🎮

Open Studio and start exploring 40+ advanced DeFi tools:
```
https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```

Select: **godmode_agent**
