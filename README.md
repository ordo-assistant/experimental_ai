# Composio Multi-Agent System

A LangGraph-powered multi-agent system using Composio tools and Cerebras for fast inference.

## Project Structure

```
composio_agent/
├── src/                    # Source code
│   ├── agent-cerebras.js   # Single Cerebras agent
│   ├── agent.js            # OpenAI agent (alternative)
│   └── multi-agent.js      # Multi-agent orchestration system
├── docs/                   # Documentation files
├── .env                    # Environment variables
├── langgraph.json          # LangGraph configuration
└── package.json            # Dependencies and scripts
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file with your API keys:

```bash
# Required
COMPOSIO_API_KEY=your_composio_api_key
CEREBRAS_API_KEY=your_cerebras_api_key
LANGSMITH_API_KEY=your_langsmith_api_key

# Optional
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Get your API keys:
- Composio: https://platform.composio.dev/settings
- Cerebras: https://cloud.cerebras.ai
- LangSmith: https://smith.langchain.com/settings

## Usage

### Run LangGraph Studio (Recommended)

Start the development server with visual debugging:

```bash
pnpm dev
```

Then open: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024

### Run Agents Directly

```bash
# Single Cerebras agent
pnpm start:agent

# Multi-agent system
pnpm start:multi
```

## Agents

### Single Agent (`agent-cerebras.js`)
- Uses Cerebras Llama 3.3 70B for fast inference
- GitHub toolkit integration
- Simple task execution

### Multi-Agent System (`multi-agent.js`)
- Supervisor agent for task routing
- Specialized GitHub agent
- Specialized Gmail agent
- Handles complex cross-domain tasks

## Example Tasks

```javascript
// GitHub operations
"Star the composiohq/composio repository on GitHub"
"List all open issues in composiohq/composio"

// Email operations
"Check my latest emails"
"Send an email summary"

// Multi-agent tasks
"List GitHub issues and email me a summary"
```

## Features

- 🚀 Fast inference with Cerebras
- 🔧 500+ tools via Composio
- 🎯 Multi-agent orchestration
- 🎨 Visual debugging with LangGraph Studio
- 💾 Stateful conversations
- 🔄 Hot reloading in dev mode

## Learn More

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Composio Documentation](https://docs.composio.dev/)
- [Cerebras Documentation](https://cerebras.ai/docs)
