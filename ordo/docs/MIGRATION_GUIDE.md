# 🔄 Migration Guide - JavaScript to TypeScript

## Overview

Panduan lengkap untuk migrasi dari JavaScript ke TypeScript dengan struktur folder yang terorganisir.

---

## 📊 Migration Status

### Phase 1: Infrastructure ✅ COMPLETE
- [x] Create new folder structure
- [x] Set up TypeScript configs
- [x] Create shared utilities (`lib/`)
- [x] Create config management
- [x] Create logger
- [x] Create type definitions
- [x] Create utility functions

### Phase 2: Basic Agents ⏳ IN PROGRESS
- [x] Convert `simple-agent.js` → `agents/basic/simple.agent.ts`
- [ ] Convert `agent-cerebras.js` → `agents/basic/cerebras.agent.ts`

### Phase 3: Composio Agents ⏳ IN PROGRESS
- [x] Convert `composio-meta-agent.js` → `agents/composio/meta.agent.ts`
- [ ] Convert `composio-github-agent.js` → `agents/composio/github.agent.ts`
- [ ] Convert `multi-user-github-agent.js` → `agents/composio/multi-user.agent.ts`

### Phase 4: LLM Agents 📋 TODO
- [ ] Convert `openrouter-agent.js` → `agents/llm/openrouter.agent.ts`
- [ ] Convert `openrouter-tools-agent.js` → `agents/llm/openrouter-tools.agent.ts`

### Phase 5: Search Agents 📋 TODO
- [ ] Convert `tavily-agent.js` → `agents/search/tavily.agent.ts`

### Phase 6: Web3 Agents 📋 TODO
- [ ] Convert `solana-agent.js` → `agents/web3/solana.agent.ts`
- [ ] Convert `web3-agent.js` → `agents/web3/web3.agent.ts`
- [ ] Convert `godmode-agent.js` → `agents/web3/godmode.agent.ts`
- [ ] Convert `ultimate-agent.js` → `agents/web3/ultimate.agent.ts`

### Phase 7: Tools Organization 📋 TODO
- [ ] Extract Composio tools → `tools/composio/`
- [ ] Extract Search tools → `tools/search/`
- [ ] Extract Web3 tools → `tools/web3/`
- [ ] Create tool index files

### Phase 8: MCP Integration 📋 TODO
- [ ] Move MCP servers → `mcp-servers/`
- [ ] Create MCP clients → `mcp/clients/`
- [ ] Set up MCP integrations

### Phase 9: Configuration 📋 TODO
- [ ] Update `langgraph.json` with new paths
- [ ] Update `package.json` scripts
- [ ] Update imports in all files
- [ ] Test all agents

### Phase 10: Documentation 📋 TODO
- [ ] Update README with new structure
- [ ] Create agent-specific docs
- [ ] Create tool-specific docs
- [ ] Create MCP docs
- [ ] Update all guides

---

## 🏗️ New Structure

```
apps/agents/src/
├── agents/              # Agent implementations
│   ├── basic/           # ✅ Simple agents
│   ├── composio/        # ⏳ Composio agents
│   ├── llm/             # 📋 LLM provider agents
│   ├── search/          # 📋 Search agents
│   ├── web3/            # 📋 Web3 agents
│   └── prebuilt/        # Pre-built agents
├── tools/               # Tool definitions
│   ├── composio/
│   ├── search/
│   └── web3/
├── mcp/                 # MCP integrations
│   └── clients/
└── lib/                 # ✅ Shared utilities
    ├── config.ts        # ✅ Configuration
    ├── logger.ts        # ✅ Logging
    ├── types.ts         # ✅ Type definitions
    ├── utils.ts         # ✅ Utilities
    └── index.ts         # ✅ Exports
```

---

## 🔧 Migration Steps

### Step 1: Create New Agent File

**Old Location:**
```
apps/agents/src/simple-agent.js
```

**New Location:**
```
apps/agents/src/agents/basic/simple.agent.ts
```

### Step 2: Convert to TypeScript

**Before (JavaScript):**
```javascript
import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';

const model = new ChatCerebras({
  model: 'llama-3.3-70b',
  temperature: 0,
  apiKey: process.env.CEREBRAS_API_KEY,
});

async function callModel(state) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('agent', callModel)
  .addEdge(START, 'agent')
  .addEdge('agent', END);

export const app = workflow.compile();
```

**After (TypeScript):**
```typescript
import { ChatCerebras } from '@langchain/cerebras';
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph';
import type { CompiledStateGraph } from '@langchain/langgraph';
import { config, logger } from '../../lib';

const model = new ChatCerebras({
  model: config.llm.cerebras.model,
  temperature: 0,
  apiKey: config.llm.cerebras.apiKey,
});

async function callModel(state: typeof MessagesAnnotation.State) {
  logger.debug('Simple Agent: Calling model');
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

function buildWorkflow(): CompiledStateGraph<typeof MessagesAnnotation.State> {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addEdge(START, 'agent')
    .addEdge('agent', END);

  return workflow.compile();
}

export const app = buildWorkflow();

logger.success('Simple Agent initialized');
```

### Step 3: Update langgraph.json

**Before:**
```json
{
  "graphs": {
    "simple_agent": "./apps/agents/src/simple-agent.js:app"
  }
}
```

**After:**
```json
{
  "graphs": {
    "simple_agent": "./apps/agents/src/agents/basic/simple.agent.ts:app"
  }
}
```

### Step 4: Test Agent

```bash
cd ordo
pnpm dev
```

Open Studio and test the agent.

---

## 📝 Naming Conventions

### Files
- **Agents:** `*.agent.ts` (e.g., `simple.agent.ts`)
- **Tools:** `*.tools.ts` (e.g., `github.tools.ts`)
- **MCP Clients:** `*.client.ts` (e.g., `devrel.client.ts`)
- **Types:** `*.types.ts` (e.g., `agent.types.ts`)
- **Utils:** `*.utils.ts` (e.g., `string.utils.ts`)
- **Config:** `*.config.ts` (e.g., `env.config.ts`)

### Exports
- **Named exports:** `export const metaAgent = ...`
- **Default export:** `export default app`
- **Type exports:** `export type { AgentConfig }`

---

## 🎯 Benefits

### Type Safety
```typescript
// ✅ TypeScript catches errors at compile time
const config: Config = {
  apiKey: 123,  // ❌ Error: Type 'number' is not assignable to type 'string'
};

// ✅ Auto-completion in IDE
config.llm.cerebras.  // IDE shows: apiKey, model
```

### Better Organization
```typescript
// ✅ Clear imports
import { config, logger } from '../../lib';
import { metaAgent } from '../composio/meta.agent';

// ❌ Old way
import config from '../../../config.js';
import logger from '../../../logger.js';
```

### Improved Maintainability
```typescript
// ✅ Easy to find and update
apps/agents/src/agents/composio/meta.agent.ts
apps/agents/src/tools/composio/meta.tools.ts

// ❌ Old way
apps/agents/src/composio-meta-agent.js
```

---

## 🔍 Checklist for Each Agent

- [ ] Create new `.agent.ts` file in appropriate folder
- [ ] Add TypeScript types for all parameters
- [ ] Import from `lib/` instead of direct env vars
- [ ] Use `logger` instead of `console.log`
- [ ] Add JSDoc comments
- [ ] Export both named and default
- [ ] Update `langgraph.json`
- [ ] Test in Studio
- [ ] Update documentation
- [ ] Mark old file for deletion (after testing)

---

## 🚨 Common Issues

### Issue 1: Import Errors

**Problem:**
```typescript
import { config } from '../../lib';  // ❌ Cannot find module
```

**Solution:**
```typescript
import { config } from '../../lib/index';  // ✅ Explicit index
// or
import { config } from '../../lib/config';  // ✅ Direct import
```

### Issue 2: Type Errors

**Problem:**
```typescript
async function callModel(state) {  // ❌ Parameter 'state' implicitly has an 'any' type
```

**Solution:**
```typescript
async function callModel(state: typeof MessagesAnnotation.State) {  // ✅ Explicit type
```

### Issue 3: Module Resolution

**Problem:**
```
Cannot find module '@langchain/cerebras'
```

**Solution:**
```bash
cd ordo/apps/agents
pnpm install
```

---

## 📚 Resources

### TypeScript
- **Handbook**: https://www.typescriptlang.org/docs/handbook/
- **Best Practices**: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html

### LangChain TypeScript
- **Docs**: https://js.langchain.com/docs/
- **API Reference**: https://api.js.langchain.com/

### Project Structure
- **FOLDER_STRUCTURE.md**: Detailed structure guide
- **COMPLETE_SETUP_GUIDE.md**: Setup instructions

---

## 🎉 Summary

Migration provides:

- ✅ Type safety
- ✅ Better organization
- ✅ Improved maintainability
- ✅ Enhanced developer experience
- ✅ Production-ready code
- ✅ Scalable architecture

**Current Progress:** 2/12 agents migrated (17%)

**Next Steps:**
1. Complete basic agents
2. Migrate Composio agents
3. Migrate LLM agents
4. Migrate search agents
5. Migrate Web3 agents
6. Organize tools
7. Set up MCP
8. Update documentation

---

**Note:** Old JavaScript files will be kept until all agents are migrated and tested. Once migration is complete and stable, old files will be removed.
