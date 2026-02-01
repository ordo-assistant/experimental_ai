# Web3 Agent Setup - Complete Solana Integration

## 🚀 What's New

I've added **comprehensive Web3/Solana capabilities** to your Ordo project using the Solana Agent Kit!

### New Agent: `web3_agent`

The most powerful blockchain agent with **60+ Solana actions**:

## 🎯 Capabilities

### Token Operations
- ✅ Deploy SPL tokens
- ✅ Deploy Token2022
- ✅ Transfer assets
- ✅ Check balances
- ✅ Stake SOL
- ✅ ZK compressed airdrops
- ✅ Bridge tokens across chains (Wormhole, deBridge)

### NFT Management
- ✅ Create collections (Metaplex & 3.Land)
- ✅ Mint NFTs
- ✅ List NFTs for sale
- ✅ Metadata management
- ✅ Royalty configuration

### DeFi Integration
- ✅ Jupiter Exchange swaps
- ✅ Launch tokens on Pump.fun
- ✅ Raydium pool creation (CPMM, CLMM, AMMv4)
- ✅ Orca Whirlpool integration
- ✅ Manifest market creation & limit orders
- ✅ Meteora Dynamic AMM, DLMM Pool
- ✅ Openbook market creation
- ✅ Jito Bundles
- ✅ Pyth Price feeds

### Advanced DeFi
- ✅ Drift Vaults, Perps, Lending, Borrowing
- ✅ Adrena Protocol perpetuals
- ✅ Sanctum LST operations
- ✅ Voltr Strategy vaults
- ✅ Cross-chain bridging

### Solana Blinks
- ✅ Lulo lending (Best USDC APR)
- ✅ Arcade games
- ✅ JupSOL staking
- ✅ Solayer SOL staking

### Market Data
- ✅ CoinGecko Pro API
- ✅ Real-time token prices
- ✅ Trending tokens and pools
- ✅ Top gainers analysis
- ✅ Allora price inference
- ✅ Switchboard feed simulation

## 🔑 Setup

### 1. Generate Solana Wallet (If Needed)

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Generate new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# Get your private key (base58)
solana-keygen pubkey ~/.config/solana/id.json
```

Or use an existing wallet's private key.

### 2. Add to `.env`

```bash
# Required
SOLANA_PRIVATE_KEY=your_base58_private_key
RPC_URL=https://api.mainnet-beta.solana.com

# Optional (for OpenAI features)
OPENAI_API_KEY=your_openai_key

# Optional (for OKX DEX)
OKX_API_KEY=your_okx_key
OKX_SECRET_KEY=your_okx_secret
OKX_API_PASSPHRASE=your_passphrase
OKX_PROJECT_ID=your_project_id
```

### 3. Restart Server

```bash
cd ordo
pnpm dev
```

## 💡 Example Queries

### Token Operations
```
"Deploy a new SPL token called MyToken with symbol MTK"
"Transfer 1 SOL to [address]"
"Check my SOL balance"
"Stake 5 SOL"
"Send compressed airdrop to 100 addresses"
```

### NFT Operations
```
"Create an NFT collection called My Art"
"Mint an NFT in my collection"
"List my NFT for 2 SOL"
"Create NFT on 3.Land marketplace"
```

### DeFi Trading
```
"Swap 1 SOL for USDC on Jupiter"
"Create a Raydium liquidity pool"
"Open a long position on SOL with 5x leverage"
"Lend 100 USDC on Lulo"
"Stake SOL on Solayer"
```

### Market Data
```
"Get current price of SOL"
"Show me trending tokens"
"What are the top gainers today?"
"Get price inference for SOL from Allora"
"Show latest pools on Raydium"
```

### Advanced DeFi
```
"Create a Drift vault"
"Deposit 100 USDC into Drift"
"Open perpetual trade on Drift"
"Add liquidity to Sanctum pool"
"Swap LST tokens on Sanctum"
```

### Cross-Chain
```
"Bridge 1 SOL to Ethereum"
"Check supported chains for bridging"
"Get bridge transaction status"
```

## 🛠️ Agent Comparison

| Agent | Focus | Tools | Best For |
|-------|-------|-------|----------|
| **web3_agent** | 🌟 Full Web3 | 60+ actions | Everything Solana |
| solana_agent | Basic blockchain | 3 tools | NFT queries only |
| tavily_agent | Web search | 2 tools | Research |
| github_agent | Code repos | GitHub API | Development |

## 📊 Available Tools (60+)

### Token Tools
- `deploy_token` - Deploy SPL token
- `deploy_token_2022` - Deploy Token2022
- `transfer` - Transfer assets
- `get_balance` - Check balance
- `stake_with_jup` - Stake SOL
- `send_compressed_airdrop` - ZK airdrop

### NFT Tools
- `deploy_collection` - Create collection
- `mint_nft` - Mint NFT
- `create_3land_collection` - 3.Land collection
- `create_3land_single` - 3.Land NFT

### DeFi Tools
- `trade` - Jupiter swap
- `launch_pump_fun_token` - Pump.fun launch
- `create_raydium_pool` - Raydium pool
- `create_orca_pool` - Orca pool
- `lend_assets` - Lulo lending
- `stake_with_solayer` - Solayer staking

### Drift Tools
- `create_drift_user_account` - Create account
- `create_drift_vault` - Create vault
- `deposit_into_drift_vault` - Deposit
- `drift_perp_trade` - Perpetual trade
- `withdraw_from_drift_user_account` - Withdraw

### Market Data Tools
- `get_token_price_data` - CoinGecko prices
- `get_trending_tokens` - Trending tokens
- `get_top_gainers` - Top gainers
- `get_price_inference` - Allora inference
- `simulate_switchboard_feed` - Switchboard

### Bridge Tools
- `get_debridge_supported_chains` - Supported chains
- `create_debridge_order` - Create bridge order
- `execute_debridge_order` - Execute bridge
- `check_debridge_transaction_status` - Check status

## 🚨 Important Notes

### Security
- **Never commit private keys** to git
- Use `.env` for all sensitive data
- Test on devnet first before mainnet
- Keep small amounts in agent wallets

### Costs
- Most operations require SOL for gas
- Token deployments: ~0.01-0.1 SOL
- NFT minting: ~0.01 SOL
- Swaps: Variable fees
- Bridge: Cross-chain fees apply

### Rate Limits
- RPC: Use paid RPC for production
- Free RPC: Limited requests
- Consider Helius/QuickNode for scale

## 🎓 Learning Resources

### Solana Agent Kit
- GitHub: https://github.com/sendaifun/solana-agent-kit
- Docs: https://docs.sendai.fun

### Solana
- Docs: https://docs.solana.com
- Cookbook: https://solanacookbook.com

### DeFi Protocols
- Jupiter: https://jup.ag
- Raydium: https://raydium.io
- Drift: https://drift.trade
- Sanctum: https://sanctum.so

## 🔧 Troubleshooting

### "Wallet not initialized"
- Check `SOLANA_PRIVATE_KEY` in `.env`
- Ensure it's base58 encoded
- Restart server

### "Insufficient funds"
- Add SOL to your wallet
- Check balance with "Check my SOL balance"
- Use devnet for testing

### "RPC error"
- Check `RPC_URL` in `.env`
- Try different RPC provider
- Consider paid RPC for reliability

### "Tool not found"
- Restart server after adding keys
- Check console for initialization errors
- Verify Solana Agent Kit installed

## 🎯 Next Steps

1. **Generate wallet** or use existing
2. **Add private key** to `.env`
3. **Fund wallet** with SOL
4. **Test basic operations** (balance, transfer)
5. **Explore DeFi** (swap, stake, lend)
6. **Try advanced features** (NFTs, perps, vaults)

## 💰 Recommended Starting Balance

- **Testing**: 0.1 SOL
- **Light usage**: 1 SOL
- **Active trading**: 5+ SOL
- **DeFi operations**: 10+ SOL

---

**Ready to start?** Open Studio and select `web3_agent`:

https://smith.langchain.com/studio?baseUrl=http://localhost:2024

Try: "Check my SOL balance" or "Get current price of SOL"
