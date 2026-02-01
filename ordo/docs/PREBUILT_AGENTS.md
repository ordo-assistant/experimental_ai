# Pre-built Agents Documentation

## Overview

Pre-built agents are production-ready patterns that demonstrate advanced LangGraph capabilities. All agents have been updated to use shared utilities for consistency.

## Available Agents

### 1. ReAct Agent

**Pattern:** Reasoning and Acting

**Location:** `apps/agents/src/agents/prebuilt/react-agent/`

**Description:**
Implements the ReAct (Reasoning and Acting) pattern where the agent alternates between reasoning about what to do and taking actions with tools.

**Features:**
- Dynamic tool selection
- Reasoning before action
- Configurable system prompt
- Multiple tool support

**Configuration:**
```typescript
{
  model: "anthropic/claude-3-5-sonnet-20241022",
  systemPromptTemplate: "You are a helpful assistant. Current time: {system_time}"
}
```

**Usage:**
```bash
# In Studio, select: agent
Query: "What is 2 + 2?"
```

**Modifications:**
- Added shared logger integration
- Clean code without comments
- Professional logging at each step

### 2. Memory Agent

**Pattern:** Conversation Memory

**Location:** `apps/agents/src/agents/prebuilt/memory-agent/`

**Description:**
Maintains conversation context across sessions using persistent storage. Stores and retrieves user-specific memories.

**Features:**
- User-specific memory storage
- Automatic memory retrieval
- Context-aware responses
- Persistent across sessions

**Configuration:**
```typescript
{
  userId: "user_123",
  systemPrompt: "You are a helpful assistant with memory. {user_info}",
  model: "anthropic/claude-3-5-sonnet-20241022"
}
```

**Usage:**
```bash
# In Studio, select: memory_agent
Query: "My name is John"
# Later session
Query: "What is my name?"
Response: "Your name is John"
```

**Modifications:**
- Added shared logger integration
- Clean logging for memory operations
- Professional code structure

### 3. Research Agent

**Pattern:** Multi-step Research

**Location:** `apps/agents/src/agents/prebuilt/research-agent/`

**Description:**
Complex multi-graph system for conducting research tasks. Includes indexing and retrieval capabilities.

**Features:**
- Document indexing
- Multi-step research
- Source citation
- Retrieval augmented generation

**Sub-graphs:**
- Index Graph: Document indexing
- Retrieval Graph: Information retrieval
- Researcher Graph: Research coordination

**Configuration:**
```typescript
{
  model: "anthropic/claude-3-5-sonnet-20241022",
  maxSearchResults: 10,
  indexingMode: "auto"
}
```

**Usage:**
```bash
# In Studio, select: research_agent
Query: "Research the latest developments in AI"
```

**Status:**
Complex multi-graph system maintained as-is for stability.

### 4. Retrieval Agent

**Pattern:** RAG (Retrieval Augmented Generation)

**Location:** `apps/agents/src/agents/prebuilt/retrieval-agent/`

**Description:**
Implements RAG pattern for answering questions based on retrieved documents.

**Features:**
- Document retrieval
- Context-aware answers
- Source attribution
- Vector search integration

**Configuration:**
```typescript
{
  model: "anthropic/claude-3-5-sonnet-20241022",
  retrievalK: 5,
  vectorStore: "pinecone"
}
```

**Usage:**
```bash
# In Studio, select: retrieval_agent
Query: "What does the documentation say about X?"
```

**Status:**
Complex retrieval system maintained as-is for stability.

## Shared Utilities Integration

### Logger Integration

All modified agents now use the shared logger:

```typescript
import { logger } from "../../../lib/index.js";

logger.debug('Agent: Processing request');
logger.success('Agent: Task completed');
logger.error('Agent: Error occurred', error);
```

### Benefits

1. **Consistent Logging:** All agents log in the same format
2. **Professional Output:** Clean, readable logs
3. **Debug Support:** Easy to trace execution
4. **Error Tracking:** Standardized error logging

## Comparison with Custom Agents

### Pre-built Agents

**Pros:**
- Production-ready patterns
- Well-tested implementations
- Complex multi-graph support
- Comprehensive documentation

**Cons:**
- More complex structure
- Harder to customize
- Multiple configuration files

### Custom Agents

**Pros:**
- Simple, clean code
- Easy to understand
- Easy to customize
- Single file implementation

**Cons:**
- Need to implement patterns yourself
- Less feature-rich out of the box

## When to Use Each

### Use Pre-built Agents When:

1. **ReAct Agent:**
   - Need reasoning before action
   - Multiple tool coordination
   - Complex decision making

2. **Memory Agent:**
   - Multi-session conversations
   - User-specific context
   - Personalized responses

3. **Research Agent:**
   - Multi-step research tasks
   - Document analysis
   - Source citation needed

4. **Retrieval Agent:**
   - Question answering from docs
   - RAG implementation
   - Knowledge base queries

### Use Custom Agents When:

1. **Simple Tasks:**
   - Single-purpose operations
   - Direct tool execution
   - No complex patterns needed

2. **Specific Integrations:**
   - Composio toolkits
   - Web3 operations
   - Search tasks

3. **Custom Workflows:**
   - Unique business logic
   - Specific tool combinations
   - Custom routing

## Configuration Files

### ReAct Agent

```
react-agent/
├── graph.ts           - Main graph definition
├── configuration.ts   - Configuration schema
├── tools.ts          - Tool definitions
└── utils.ts          - Helper functions
```

### Memory Agent

```
memory-agent/
├── graph.ts           - Main graph with memory
├── configuration.ts   - Configuration schema
├── state.ts          - State definition
├── tools.ts          - Memory tools
├── prompts.ts        - System prompts
└── utils.ts          - Helper functions
```

### Research Agent

```
research-agent/
├── index-graph/       - Document indexing
├── retrieval-graph/   - Information retrieval
├── shared/           - Shared utilities
└── static/           - Static assets
```

### Retrieval Agent

```
retrieval-agent/
├── graph.ts           - Main RAG graph
├── configuration.ts   - Configuration schema
├── state.ts          - State definition
└── utils.ts          - Retrieval utilities
```

## Testing

### Start Server

```bash
cd ordo
pnpm dev
```

### Test Each Agent

**ReAct Agent:**
```
Query: "Calculate 15 * 23 and tell me the result"
Expected: Uses calculator tool, returns 345
```

**Memory Agent:**
```
Session 1: "My favorite color is blue"
Session 2: "What is my favorite color?"
Expected: "Your favorite color is blue"
```

**Research Agent:**
```
Query: "Research quantum computing applications"
Expected: Multi-step research with sources
```

**Retrieval Agent:**
```
Query: "What does the documentation say about agents?"
Expected: Answer based on retrieved docs
```

## Customization

### Modifying ReAct Agent

```typescript
// In graph.ts
async function callModel(state, config) {
  logger.debug('Custom logic here');
  
  // Your modifications
  
  return { messages: [response] };
}
```

### Modifying Memory Agent

```typescript
// In graph.ts
async function callModel(state, config) {
  logger.debug('Custom memory logic');
  
  // Your modifications
  
  return { messages: [result] };
}
```

## Best Practices

### 1. Use Appropriate Agent

Choose the right agent for your use case:
- Simple tasks: Custom agents
- Complex patterns: Pre-built agents

### 2. Configure Properly

Set appropriate configuration:
- Model selection
- Temperature
- System prompts
- Tool selection

### 3. Monitor Performance

Track agent performance:
- Execution time
- Token usage
- Success rate
- Error frequency

### 4. Handle Errors

Implement proper error handling:
- Try-catch blocks
- Fallback logic
- User-friendly messages

## Migration from JavaScript

All pre-built agents were already in TypeScript. Updates made:

1. Added shared logger integration
2. Removed unnecessary comments
3. Cleaned up code structure
4. Added professional logging

## Future Enhancements

### Planned Features

1. More pre-built patterns
2. Enhanced memory capabilities
3. Better retrieval strategies
4. Performance optimizations

### Potential Patterns

- Planning Agent: Multi-step planning
- Critic Agent: Self-evaluation
- Ensemble Agent: Multiple model voting
- Streaming Agent: Real-time responses

## Conclusion

Pre-built agents provide production-ready patterns for common use cases. They have been updated to use shared utilities while maintaining their complex functionality.

For simple use cases, custom agents are recommended. For complex patterns, pre-built agents provide robust implementations.
