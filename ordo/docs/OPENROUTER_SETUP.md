# OpenRouter Setup - Access 200+ AI Models

## 🚀 What's New

I've added **OpenRouter integration** to your Ordo project, giving you access to **200+ AI models** from multiple providers!

### New Agents

1. **openrouter_agent** - Basic chat with any model
2. **openrouter_tools** - Tool calling with supported models

## 🎯 Why OpenRouter?

- **200+ Models**: GPT-4, Claude, Gemini, DeepSeek, Llama, Mistral, and more
- **Free Models**: Several free models available
- **One API Key**: Access all models with single key
- **Cost Effective**: Pay only for what you use
- **No Rate Limits**: (on paid models)
- **Automatic Fallbacks**: If one model fails, try another

## 🔑 Setup

### 1. Get OpenRouter API Key

Visit: https://openrouter.ai/keys

- Sign up (free)
- Create API key
- Add credits (optional - free models available)

### 2. Add to `.env`

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
YOUR_SITE_URL=https://github.com/your-username
YOUR_SITE_NAME=Your Project Name
```

### 3. Restart Server

```bash
cd ordo
pnpm dev
```

## 📋 Available Models

### Free Models (No Credits Needed)

```javascript
// In openrouter-agent.js, change CURRENT_MODEL to:

// DeepSeek R1 (Reasoning model)
"tngtech/deepseek-r1t2-chimera:free"

// Llama 3.2 3B
"meta-llama/llama-3.2-3b-instruct:free"

// Mistral 7B
"mistralai/mistral-7b-instruct:free"

// Phi-3 Mini
"microsoft/phi-3-mini-128k-instruct:free"

// Gemma 2 9B
"google/gemma-2-9b-it:free"
```

### Paid Models (Better Quality)

```javascript
// GPT-4 Turbo
"openai/gpt-4-turbo"

// Claude 3.5 Sonnet
"anthropic/claude-3.5-sonnet"

// DeepSeek Chat (Paid)
"deepseek/deepseek-chat"

// Gemini Pro 1.5
"google/gemini-pro-1.5"

// Llama 3.1 405B
"meta-llama/llama-3.1-405b-instruct"
```

## 💡 Usage Examples

### Basic Chat (openrouter_agent)

```
"What is the meaning of life?"
"Explain quantum computing"
"Write a poem about AI"
```

### With Tools (openrouter_tools)

```
"What is 25 * 47?"
"Calculate 100 divided by 7"
"What time is it?"
```

## 🔧 Switching Models

Edit `ordo/apps/agents/src/openrouter-agent.js`:

```javascript
// Change this line:
const CURRENT_MODEL = MODELS.deepseek_free;

// To any of these:
const CURRENT_MODEL = MODELS.gpt4;
const CURRENT_MODEL = MODELS.claude;
const CURRENT_MODEL = MODELS.llama_free;
const CURRENT_MODEL = "any-model-id-from-openrouter";
```

Then restart the server.

## 📊 Model Comparison

| Model | Cost | Speed | Quality | Tools | Best For |
|-------|------|-------|---------|-------|----------|
| DeepSeek Free | Free | Fast | Good | ❌ | General chat |
| Llama 3.2 Free | Free | Fast | Good | ❌ | Quick tasks |
| GPT-4 Turbo | $$ | Medium | Excellent | ✅ | Complex tasks |
| Claude 3.5 | $$$ | Medium | Excellent | ✅ | Reasoning |
| DeepSeek Paid | $ | Fast | Very Good | ✅ | Cost-effective |

## 🎯 Agent Comparison

| Agent | Model | Cost | Tools | Best For |
|-------|-------|------|-------|----------|
| simple_agent | Cerebras | Free* | ❌ | Basic chat |
| openrouter_agent | Any | Varies | ❌ | Model flexibility |
| openrouter_tools | GPT-4 | Paid | ✅ | Tool calling |
| tavily_agent | Cerebras | Free* | ✅ | Web search |
| web3_agent | Cerebras | Free* | ✅ | Blockchain |

*Already have API key

## 💰 Pricing

### Free Tier
- Several models completely free
- No credit card required
- Rate limits apply

### Paid Models
- Pay per token
- Prices vary by model
- Check: https://openrouter.ai/models

### Example Costs
- GPT-4 Turbo: ~$10 per 1M tokens
- Claude 3.5: ~$15 per 1M tokens
- DeepSeek: ~$0.14 per 1M tokens
- Free models: $0

## 🚀 Advanced Features

### Model Routing

OpenRouter can automatically route to the best available model:

```javascript
const completion = await openrouter.chat.completions.create({
  model: "openrouter/auto", // Automatic routing
  messages: messages,
  route: "fallback", // Try alternatives if primary fails
});
```

### Model Preferences

```javascript
const completion = await openrouter.chat.completions.create({
  model: "anthropic/claude-3.5-sonnet",
  messages: messages,
  transforms: ["middle-out"], // Compression
  models: ["openai/gpt-4-turbo"], // Fallback
});
```

## 🛠️ Troubleshooting

### "Invalid API key"
- Check `OPENROUTER_API_KEY` in `.env`
- Verify key at https://openrouter.ai/keys
- Restart server

### "Insufficient credits"
- Free models don't need credits
- Add credits at https://openrouter.ai/credits
- Switch to free model

### "Model not found"
- Check model ID at https://openrouter.ai/models
- Verify spelling in code
- Some models require approval

### "Rate limit exceeded"
- Free models have rate limits
- Wait a few minutes
- Upgrade to paid model
- Add credits to account

## 📚 Resources

- **OpenRouter**: https://openrouter.ai
- **Models**: https://openrouter.ai/models
- **Docs**: https://openrouter.ai/docs
- **Pricing**: https://openrouter.ai/models (see individual models)
- **Discord**: https://discord.gg/openrouter

## 🎓 Best Practices

1. **Start Free**: Test with free models first
2. **Monitor Costs**: Check usage dashboard
3. **Use Fallbacks**: Configure backup models
4. **Cache Responses**: Reduce API calls
5. **Choose Wisely**: Match model to task complexity

## 🔄 Model Selection Guide

### For General Chat
- Free: `deepseek-r1t2-chimera:free`
- Paid: `deepseek/deepseek-chat`

### For Reasoning
- Free: `deepseek-r1t2-chimera:free`
- Paid: `anthropic/claude-3.5-sonnet`

### For Coding
- Free: `meta-llama/llama-3.2-3b-instruct:free`
- Paid: `openai/gpt-4-turbo`

### For Tool Calling
- Paid: `openai/gpt-4-turbo`
- Paid: `anthropic/claude-3.5-sonnet`

### For Cost Efficiency
- Free: Any `:free` model
- Paid: `deepseek/deepseek-chat`

## 🎯 Next Steps

1. **Get API key**: https://openrouter.ai/keys
2. **Add to `.env`**: `OPENROUTER_API_KEY=your-key`
3. **Restart server**: `pnpm dev`
4. **Test agent**: Select `openrouter_agent` in Studio
5. **Try models**: Switch between free and paid models

---

**Ready?** Get your API key and start using 200+ models!

https://openrouter.ai/keys
