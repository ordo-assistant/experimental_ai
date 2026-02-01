# Hierarchical Multi-Agent System

## Overview

Ordo implements a professional hierarchical multi-agent system with multiple LLMs at different levels for optimal performance and cost efficiency.

## Architecture

### Three-Level Hierarchy

```
Level 1: Supervisor (GPT-4 Turbo)
    |
    +-- Level 2: Coordinators (Claude 3.5 Sonnet / Cerebras)
            |
            +-- Level 3: Workers (Specialized Agents)
```

### Flow Diagram

```
User Request
    |
    v
Supervisor Agent (GPT-4)
    |
    +-- Composio Coordinator (Claude)
    |       |
    |       +-- GitHub Worker
    |       +-- Meta Worker
    |
    +-- Search Coordinator (Cerebras)
    |       |
    |       +-- Tavily Worker
    |       +-- Web Worker
    |
    +-- Web3 Coordinator (Cerebras)
    |       |
    |       +-- Solana Worker
    |       +-- DeFi Worker
    |       +-- God Mode Worker
    |
    +-- LLM Coordinator (OpenRouter)
            |
            +-- GPT Worker
            +-- Claude Worker
            +-- DeepSeek Worker
```

## Level 1: Supervisor Agent

### Responsibility
Routes incoming requests to appropriate coordinators based on task analysis.

### LLM
GPT-4 Turbo - Best reasoning for high-level routing decisions

### Decision Making
Analyzes user query and determines which domain coordinator should handle it:
- Composio tasks (GitHub, Gmail, 800+ apps)
- Search tasks (web search, content extraction)
- Web3 tasks (blockchain, DeFi, NFTs)
- LLM tasks (multi-model comparisons)

### Example Routing

```typescript
User: "Create a GitHub issue for bug XYZ"
Supervisor: Routes to composio_coordinator

User: "Search for latest AI news"
Supervisor: Routes to search_coordinator

User: "Get my Solana NFTs"
Supervisor: Routes to web3_coordinator

User: "Compare GPT-4 and Claude responses"
Supervisor: Routes to llm_coordinator
```

## Level 2: Coordinator Agents

### Composio Coordinator

**LLM:** Claude 3.5 Sonnet - Excellent at task decomposition

**Workers:**
- github_worker: GitHub operations
- meta_worker: Dynamic tool discovery

**Routing Logic:**
```typescript
"Create issue" -> github_worker
"Find Slack tools" -> meta_worker
"Star repository" -> github_worker
```

### Search Coordinator

**LLM:** Cerebras Llama 3.3 70B - Fast and cost-effective

**Workers:**
- tavily_worker: Web search
- extract_worker: Content extraction

**Routing Logic:**
```typescript
"Search for news" -> tavily_worker
"Extract from URL" -> extract_worker
```

### Web3 Coordinator

**LLM:** Cerebras Llama 3.3 70B - Fast routing for blockchain tasks

**Workers:**
- solana_worker: NFT and wallet operations
- defi_worker: Trading and swaps
- godmode_worker: Advanced DeFi

**Routing Logic:**
```typescript
"Get NFTs" -> solana_worker
"Swap tokens" -> defi_worker
"Create DCA" -> godmode_worker
"Check balance" -> solana_worker
```

### LLM Coordinator

**LLM:** OpenRouter - Access to multiple models

**Workers:**
- gpt_worker: OpenAI models
- claude_worker: Anthropic models
- deepseek_worker: DeepSeek models

**Routing Logic:**
```typescript
"Use GPT-4" -> gpt_worker
"Use Claude" -> claude_worker
"Use free model" -> deepseek_worker
```

## Level 3: Worker Agents

### Characteristics
- Specialized in specific tools
- Execute actual operations
- Return results to coordinator
- Use appropriate LLM for task

### Examples

**GitHub Worker:**
- Tools: create_issue, star_repo, list_repos
- LLM: Cerebras (fast, cost-effective)

**Solana Worker:**
- Tools: get_nfts, get_balance, get_asset
- LLM: Cerebras (fast queries)

**DeFi Worker:**
- Tools: swap, trade, lend, stake
- LLM: Cerebras (fast execution)

**God Mode Worker:**
- Tools: 40+ advanced DeFi operations
- LLM: Cerebras (complex operations)

## Multi-LLM Strategy

### Level 1: GPT-4 Turbo
**Why:** Best reasoning for complex routing decisions
**Cost:** High, but only for routing
**Usage:** Minimal (one call per request)

### Level 2: Claude 3.5 Sonnet / Cerebras
**Why:** 
- Claude: Excellent task decomposition
- Cerebras: Fast and cost-effective
**Cost:** Medium to Low
**Usage:** Moderate (one call per coordinator)

### Level 3: Cerebras / Specialized
**Why:** Fast execution, cost-effective
**Cost:** Low
**Usage:** High (multiple tool calls)

## Cost Optimization

### Request Flow Cost

```
User Request
    |
    v
GPT-4 (1 call) - $0.01
    |
    v
Claude/Cerebras (1 call) - $0.001
    |
    v
Cerebras (N calls) - $0.0001 each
    |
    v
Total: ~$0.01 - $0.02 per request
```

### Comparison with Single-LLM

**Single GPT-4:**
- All calls use GPT-4
- Cost: $0.01 per call
- Total: $0.05 - $0.10 per request

**Hierarchical:**
- GPT-4 only for routing
- Cheaper models for execution
- Total: $0.01 - $0.02 per request
- Savings: 50-80%

## State Management

### Supervisor State

```typescript
interface SupervisorState {
  messages: BaseMessage[];
  nextAgent: string;
  taskCompleted: boolean;
}
```

### Coordinator State

```typescript
interface CoordinatorState {
  messages: BaseMessage[];
  nextWorker: string;
  taskResult: any;
}
```

### Worker State

```typescript
interface WorkerState {
  messages: BaseMessage[];
  toolCalls: ToolCall[];
  results: any[];
}
```

## Execution Flow

### Step-by-Step

1. User sends request
2. Supervisor analyzes with GPT-4
3. Routes to appropriate coordinator
4. Coordinator analyzes with Claude/Cerebras
5. Routes to appropriate worker
6. Worker executes with tools
7. Results flow back up hierarchy
8. Final response to user

### Example: "Create GitHub issue"

```
User: "Create a GitHub issue for bug XYZ"
    |
    v
Supervisor (GPT-4): "This is a Composio task"
    |
    v
Composio Coordinator (Claude): "This needs GitHub worker"
    |
    v
GitHub Worker (Cerebras): Executes create_issue tool
    |
    v
Result: Issue #123 created
    |
    v
Coordinator: Aggregates result
    |
    v
Supervisor: Formats response
    |
    v
User: "Issue #123 created successfully"
```

## Benefits

### Performance
- Fast routing with GPT-4
- Fast execution with Cerebras
- Parallel worker execution

### Cost Efficiency
- Expensive models only for routing
- Cheap models for execution
- 50-80% cost savings

### Scalability
- Easy to add new coordinators
- Easy to add new workers
- Modular architecture

### Maintainability
- Clear separation of concerns
- Each level has specific responsibility
- Easy to debug and monitor

### Flexibility
- Different LLMs for different tasks
- Optimal model selection per level
- Easy to swap models

## Configuration

### Adding New Coordinator

```typescript
// In supervisor.agent.ts
const AVAILABLE_AGENTS = {
  // ... existing
  new_coordinator: 'Description of new coordinator',
};

// Create new coordinator file
// apps/agents/src/agents/hierarchy/new-coordinator.agent.ts
```

### Adding New Worker

```typescript
// In coordinator file
const WORKER_AGENTS = {
  // ... existing
  new_worker: 'Description of new worker',
};

// Add worker node
.addNode('new_worker', newWorkerFunction)
```

## Monitoring

### Logging

Each level logs its decisions:

```
Supervisor: Analyzing request
Supervisor: Routing to web3_coordinator
Web3 Coordinator: Analyzing task
Web3 Coordinator: Delegating to solana_worker
Solana Worker: Executing task
Solana Worker: Task completed
```

### Metrics

Track per level:
- Execution time
- Token usage
- Cost
- Success rate

## Testing

### Start Server

```bash
cd ordo
pnpm dev
```

### Test Supervisor

```
Query: "Create a GitHub issue"
Expected: Routes to composio_coordinator
```

### Test Coordinator

```
Query: "Get my NFTs"
Expected: Routes to solana_worker
```

### Test Worker

```
Query: "Get balance for address X"
Expected: Executes get_balance tool
```

## Future Enhancements

### Planned Features

1. Dynamic worker selection based on load
2. Parallel coordinator execution
3. Result caching
4. Automatic retry logic
5. Performance monitoring dashboard

### Potential Coordinators

- Database Coordinator (SQL, NoSQL operations)
- Analytics Coordinator (Data analysis)
- Communication Coordinator (Email, Slack, Discord)
- File Coordinator (Storage, processing)

## Conclusion

The hierarchical multi-agent system provides:

- Optimal LLM selection per task
- Cost-effective execution
- Scalable architecture
- Clear separation of concerns
- Professional code quality

This architecture is production-ready and can handle complex multi-step tasks efficiently.
