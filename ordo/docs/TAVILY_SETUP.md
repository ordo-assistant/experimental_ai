# Tavily Agent Setup

I've added a powerful Tavily-powered search agent to your Ordo project!

## What's New

### Tavily Agent (`tavily_agent`)
- **Fast Cerebras inference** (Llama 3.3 70B)
- **Real-time web search** via Tavily API
- **Content extraction** from URLs
- **Two powerful tools**:
  - `tavily_search` - Search the web with AI-optimized results
  - `tavily_extract` - Extract clean content from URLs

## Setup

### 1. Get Your Tavily API Key

Sign up for free at: https://app.tavily.com

### 2. Add API Key to `.env`

```bash
TAVILY_API_KEY=tvly-your-actual-key-here
```

### 3. Restart the Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

## Usage

### In LangGraph Studio

1. Open: https://smith.langchain.com/studio?baseUrl=http://localhost:2024
2. Select `tavily_agent`
3. Try these prompts:

```
"Search for the latest news on AI agents"
"What are the current trends in LLM development?"
"Find information about LangGraph and summarize it"
"Extract content from https://docs.langchain.com"
```

### Example Queries

**News & Current Events:**
```
"What's happening with OpenAI today?"
"Latest developments in quantum computing"
"Current AI regulations in the EU"
```

**Research:**
```
"Compare the top 5 AI coding assistants"
"What are the best practices for RAG systems?"
"Research the competitive landscape for AI agents"
```

**Content Extraction:**
```
"Extract and summarize content from https://example.com/article"
"Get the main points from these 3 blog posts: [urls]"
```

## Features

### Tavily Search
- **AI-optimized results** - Content formatted for LLMs
- **Source citations** - Every result includes URL and title
- **Answer synthesis** - Get direct answers with sources
- **Configurable depth** - Basic or advanced search

### Tavily Extract
- **Clean content** - Removes ads, navigation, footers
- **Multiple URLs** - Extract from several pages at once
- **Markdown format** - Easy to process and read

## Available Agents

Now you have:
- ✅ `simple_agent` - Basic Cerebras agent
- ✅ `tavily_agent` - **NEW!** Cerebras + Tavily search
- ✅ `agent` - Pre-built ReAct agent
- ✅ `memory_agent` - Pre-built memory agent

## Troubleshooting

### "Error searching: 401"
- Check your `TAVILY_API_KEY` in `.env`
- Make sure you copied the full key from https://app.tavily.com

### "Tool not found"
- Restart the server after adding the API key
- Check that `tavily-agent.js` is in `apps/agents/src/`

### Rate Limits
- Free tier: 1,000 requests/month
- Upgrade at https://app.tavily.com for more

## Next Steps

1. **Get your Tavily API key**: https://app.tavily.com
2. **Add it to `.env`**
3. **Restart server**: `pnpm dev`
4. **Test in Studio**: Select `tavily_agent` and search!

## Learn More

- [Tavily Documentation](https://docs.tavily.com)
- [Tavily API Reference](https://docs.tavily.com/api-reference)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
