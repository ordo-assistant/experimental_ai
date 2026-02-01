# 📁 Folder Structure - Ordo Multi-Agent System

## Overview

Struktur folder yang terorganisir dengan baik untuk production-ready TypeScript agents, MCP servers, dan tools.

---

## 🏗️ New Folder Structure

```
ordo/
├── apps/
│   ├── agents/                      # AI Agents (TypeScript)
│   │   ├── src/
│   │   │   ├── agents/              # ✨ NEW: Agent implementations
│   │   │   │   ├── basic/           # Basic agents
│   │   │   │   │   ├── simple.agent.ts
│   │   │   │   │   └── cerebras.agent.ts
│   │   │   │   ├── composio/        # Composio-powered agents
│   │   │   │   │   ├── meta.agent.ts
│   │   │   │   │   ├── github.agent.ts
│   │   │   │   │   └── multi-user.agent.ts
│   │   │   │   ├── llm/             # LLM provider agents
│   │   │   │   │   ├── openrouter.agent.ts
│   │   │   │   │   └── openrouter-tools.agent.ts
│   │   │   │   ├── search/          # Search agents
│   │   │   │   │   └── tavily.agent.ts
│   │   │   │   ├── web3/            # Web3/Blockchain agents
│   │   │   │   │   ├── solana.agent.ts
│   │   │   │   │   ├── web3.agent.ts
│   │   │   │   │   ├── godmode.agent.ts
│   │   │   │   │   └── ultimate.agent.ts
│   │   │   │   └── prebuilt/        # Pre-built agents
│   │   │   │       ├── react-agent/
│   │   │   │       └── memory-agent/
│   │   │   ├── tools/               # ✨ NEW: Tool definitions
│   │   │   │   ├── composio/        # Composio tools
│   │   │   │   │   ├── meta.tools.ts
│   │   │   │   │   └── github.tools.ts
│   │   │   │   ├── search/          # Search tools
│   │   │   │   │   └── tavily.tools.ts
│   │   │   │   ├── web3/            # Web3 tools
│   │   │   │   │   ├── helius.tools.ts
│   │   │   │   │   ├── solana-kit.tools.ts
│   │   │   │   │   └── godmode.tools.ts
│   │   │   │   └── index.ts         # Tool exports
│   │   │   ├── mcp/                 # ✨ NEW: MCP integrations
│   │   │   │   ├── clients/         # MCP clients
│   │   │   │   │   ├── devrel.client.ts
│   │   │   │   │   ├── solana.client.ts
│   │   │   │   │   ├── tavily.client.ts
│   │   │   │   │   └── x402.client.ts
│   │   │   │   └── index.ts         # MCP exports
│   │   │   ├── lib/                 # ✨ NEW: Shared utilities
│   │   │   │   ├── config.ts        # Configuration
│   │   │   │   ├── logger.ts        # Logging
│   │   │   │   ├── types.ts         # Type definitions
│   │   │   │   └── utils.ts         # Utilities
│   │   │   └── index.ts             # Main exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                         # Web UI (React)
│       └── ...
├── mcp-servers/                     # ✨ NEW: MCP Server implementations
│   ├── devrel-mcp/                  # Jito documentation
│   ├── solana-mcp/                  # Solana tools
│   ├── tavily-mcp/                  # Web search
│   └── x402-mcp/                    # Payment protocol
├── plugins/                         # ✨ NEW: Plugin packages
│   ├── plugin-god-mode/             # God Mode DeFi plugin
│   └── solana-agent-kit/            # Solana Agent Kit
├── docs/                            # Documentation
│   ├── agents/                      # Agent guides
│   ├── mcp/                         # MCP guides
│   ├── tools/                       # Tool guides
│   └── setup/                       # Setup guides
├── examples/                        # Example implementations
│   ├── multi-user/
│   ├── custom-agents/
│   └── integrations/
├── .env                             # Environment variables
├── langgraph.json                   # LangGraph config
├── package.json                     # Root package
├── pnpm-workspace.yaml              # Workspace config
└── tsconfig.json                    # Root TypeScript config
```

---

## 📂 Detailed Structure

### 1. Agents (`apps/agents/src/agents/`)

**Purpose:** Agent implementations organized by category

```
agents/
├── basic/                    # Simple agents without external tools
│   ├── simple.agent.ts       # Basic chat agent
│   └── cerebras.agent.ts     # Cerebras-specific agent
├── composio/                 # Composio-powered agents
│   ├── meta.agent.ts         # Meta tools (800+ toolkits)
│   ├── github.agent.ts       # GitHub operations
│   └── multi-user.agent.ts   # Multi-user support
├── llm/                      # LLM provider agents
│   ├── openrouter.agent.ts   # 200+ models
│   └── openrouter-tools.agent.ts  # Models + tools
├── search/                   # Search agents
│   └── tavily.agent.ts       # Web search & extraction
├── web3/                     # Blockchain agents
│   ├── solana.agent.ts       # NFT queries (Helius)
│   ├── web3.agent.ts         # 60+ Solana tools
│   ├── godmode.agent.ts      # 40+ Advanced DeFi
│   └── ultimate.agent.ts     # 150+ ALL tools
└── prebuilt/                 # Pre-built agents
    ├── react-agent/          # ReAct pattern
    └── memory-agent/         # Conversation memory
```

### 2. Tools (`apps/agents/src/tools/`)

**Purpose:** Tool definitions and configurations

```
tools/
├── composio/
│   ├── meta.tools.ts         # Meta tools configuration
│   └── github.tools.ts       # GitHub tools
├── search/
│   └── tavily.tools.ts       # Tavily search tools
├── web3/
│   ├── helius.tools.ts       # Helius RPC tools
│   ├── solana-kit.tools.ts   # Solana Agent Kit
│   └── godmode.tools.ts      # God Mode plugin
└── index.ts                  # Centralized exports
```

### 3. MCP (`apps/agents/src/mcp/`)

**Purpose:** MCP client integrations

```
mcp/
├── clients/
│   ├── devrel.client.ts      # DevRel MCP client
│   ├── solana.client.ts      # Solana MCP client
│   ├── tavily.client.ts      # Tavily MCP client
│   └── x402.client.ts        # X402 MCP client
└── index.ts                  # MCP exports
```

### 4. Lib (`apps/agents/src/lib/`)

**Purpose:** Shared utilities and configurations

```
lib/
├── config.ts                 # Environment & config
├── logger.ts                 # Logging utilities
├── types.ts                  # TypeScript types
└── utils.ts                  # Helper functions
```

### 5. MCP Servers (`mcp-servers/`)

**Purpose:** Standalone MCP server implementations

```
mcp-servers/
├── devrel-mcp/               # Jito documentation search
│   ├── src/
│   │   └── server/
│   │       ├── index.ts
│   │       └── mcp.ts
│   ├── package.json
│   └── tsconfig.json
├── solana-mcp/               # Solana-specific tools
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── tavily-mcp/               # Web search server
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── x402-mcp/                 # Payment protocol
    ├── packages/
    │   └── x402-mcp/
    │       └── src/
    ├── package.json
    └── tsconfig.json
```

### 6. Plugins (`plugins/`)

**Purpose:** Plugin packages (moved from ordo/)

```
plugins/
├── plugin-god-mode/          # Advanced DeFi plugin
│   ├── src/
│   │   ├── birdeye/
│   │   ├── jupiter/
│   │   ├── lulo/
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
└── solana-agent-kit/         # Solana Agent Kit
    ├── packages/
    │   ├── core/
    │   ├── plugin-defi/
    │   ├── plugin-nft/
    │   └── ...
    ├── package.json
    └── pnpm-workspace.yaml
```

### 7. Documentation (`docs/`)

**Purpose:** Organized documentation

```
docs/
├── agents/                   # Agent-specific docs
│   ├── composio-meta.md
│   ├── ultimate-agent.md
│   └── ...
├── mcp/                      # MCP documentation
│   ├── devrel-mcp.md
│   ├── solana-mcp.md
│   └── ...
├── tools/                    # Tool documentation
│   ├── composio-tools.md
│   ├── web3-tools.md
│   └── ...
└── setup/                    # Setup guides
    ├── complete-setup.md
    ├── api-keys.md
    └── ...
```

---

## 🎯 Benefits of New Structure

### 1. **Clear Separation of Concerns**
- Agents in `agents/`
- Tools in `tools/`
- MCP in `mcp/`
- Shared code in `lib/`

### 2. **TypeScript Production Ready**
- All `.js` → `.ts`
- Type safety
- Better IDE support
- Compile-time checks

### 3. **Scalability**
- Easy to add new agents
- Easy to add new tools
- Easy to add new MCP servers
- Modular architecture

### 4. **Maintainability**
- Organized by feature
- Clear naming conventions
- Centralized exports
- Consistent structure

### 5. **Developer Experience**
- Easy to find files
- Logical grouping
- Auto-completion
- Type hints

---

## 🔄 Migration Plan

### Phase 1: Create New Structure ✅
1. Create new folders
2. Set up TypeScript configs
3. Create shared utilities

### Phase 2: Convert Agents to TypeScript
1. Convert basic agents
2. Convert Composio agents
3. Convert LLM agents
4. Convert search agents
5. Convert Web3 agents

### Phase 3: Organize Tools
1. Extract tool definitions
2. Create tool modules
3. Centralize exports

### Phase 4: Organize MCP
1. Move MCP servers
2. Create MCP clients
3. Set up integrations

### Phase 5: Update Documentation
1. Reorganize docs
2. Update paths
3. Add migration guide

### Phase 6: Update Configuration
1. Update `langgraph.json`
2. Update `package.json`
3. Update imports

---

## 📝 Naming Conventions

### Files
- **Agents:** `*.agent.ts` (e.g., `meta.agent.ts`)
- **Tools:** `*.tools.ts` (e.g., `github.tools.ts`)
- **MCP Clients:** `*.client.ts` (e.g., `devrel.client.ts`)
- **MCP Servers:** `*.server.ts` (e.g., `mcp.server.ts`)
- **Types:** `*.types.ts` (e.g., `agent.types.ts`)
- **Utils:** `*.utils.ts` (e.g., `string.utils.ts`)
- **Config:** `*.config.ts` (e.g., `env.config.ts`)

### Folders
- **Lowercase with hyphens:** `multi-user/`, `god-mode/`
- **Descriptive names:** `composio/`, `web3/`, `search/`
- **Plural for collections:** `agents/`, `tools/`, `clients/`

### Exports
- **Named exports preferred:** `export const metaAgent = ...`
- **Default for main:** `export default app`
- **Index files:** Re-export from modules

---

## 🚀 Usage After Migration

### Import Agents
```typescript
import { metaAgent } from '@/agents/composio/meta.agent';
import { ultimateAgent } from '@/agents/web3/ultimate.agent';
```

### Import Tools
```typescript
import { githubTools } from '@/tools/composio/github.tools';
import { tavilyTools } from '@/tools/search/tavily.tools';
```

### Import MCP Clients
```typescript
import { devrelClient } from '@/mcp/clients/devrel.client';
import { solanaClient } from '@/mcp/clients/solana.client';
```

### Import Utilities
```typescript
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';
```

---

## 📊 Comparison

| Aspect | Old Structure | New Structure |
|--------|---------------|---------------|
| **Organization** | Flat | Hierarchical |
| **Language** | JavaScript | TypeScript |
| **Type Safety** | ❌ No | ✅ Yes |
| **Scalability** | ⚠️ Limited | ✅ Excellent |
| **Maintainability** | ⚠️ Difficult | ✅ Easy |
| **IDE Support** | ⚠️ Basic | ✅ Advanced |
| **Production Ready** | ❌ No | ✅ Yes |

---

## 🎉 Summary

New structure provides:

- ✅ Clear organization by feature
- ✅ TypeScript for production
- ✅ Modular architecture
- ✅ Easy to scale
- ✅ Better maintainability
- ✅ Improved developer experience
- ✅ Type safety
- ✅ Professional structure

**Ready to migrate!** 🚀

Next steps:
1. Create new folder structure
2. Convert agents to TypeScript
3. Organize tools and MCP
4. Update configuration
5. Test everything
6. Deploy to production

---

**Note:** Migration will be done incrementally to avoid breaking existing functionality. Old files will be kept until migration is complete and tested.
