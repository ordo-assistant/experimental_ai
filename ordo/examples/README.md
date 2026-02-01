# Multi-User Examples

This directory contains examples demonstrating multi-user functionality with Composio sessions.

## Files

### 1. `multi-user-server.js`
**Full Express.js server with multi-user support**

Features:
- User authentication middleware
- Composio session management
- User-specific GitHub agents
- REST API endpoints
- Multi-user isolation testing

Run:
```bash
node examples/multi-user-server.js
```

Endpoints:
- `GET /health` - Health check
- `GET /users` - List demo users
- `GET /me` - Get current user
- `GET /github/status` - GitHub connection status
- `GET /github/connect` - Connect GitHub
- `POST /github/action` - Execute GitHub action
- `POST /github/star` - Star a repository
- `GET /test/isolation` - Test user isolation

Example:
```bash
# Get user info
curl -H "X-User-ID: user_001" http://localhost:3000/me

# Check GitHub status
curl -H "X-User-ID: user_001" http://localhost:3000/github/status

# Star a repository
curl -H "X-User-ID: user_001" \
     -H "Content-Type: application/json" \
     -d '{"repo": "composiohq/composio"}' \
     http://localhost:3000/github/star
```

### 2. `test-multi-user.js`
**Comprehensive test suite for multi-user functionality**

Tests:
- User session creation
- User isolation verification
- Agent creation per user
- Session methods (tools, toolkits, MCP)
- Connection status checking

Run:
```bash
node examples/test-multi-user.js
```

Output:
- Session creation results
- Toolkit availability
- GitHub connection status
- User isolation verification
- Agent creation tests

## Quick Start

### 1. Test Multi-User Sessions
```bash
node examples/test-multi-user.js
```

This will:
- Create sessions for 3 test users
- Check toolkit availability
- Verify user isolation
- Test agent creation

### 2. Run Multi-User Server
```bash
node examples/multi-user-server.js
```

Then test with curl:
```bash
# User 1 stars a repo
curl -H "X-User-ID: user_001" \
     -H "Content-Type: application/json" \
     -d '{"repo": "langchain-ai/langgraph"}' \
     http://localhost:3000/github/star

# User 2 stars a different repo
curl -H "X-User-ID: user_002" \
     -H "Content-Type: application/json" \
     -d '{"repo": "composiohq/composio"}' \
     http://localhost:3000/github/star

# Verify isolation
curl http://localhost:3000/test/isolation
```

## Key Concepts

### User Sessions
Each user gets their own isolated session:
```javascript
const session = await composio.create("user_123");
```

### User-Specific Tools
Tools are fetched per user:
```javascript
const tools = await session.tools({ toolkits: ["github"] });
```

### Agent Factory Pattern
Create agents on-demand for each user:
```javascript
const agent = await createGitHubAgent(userId);
const result = await agent.invoke({ messages: [...] });
```

## Best Practices

### ✅ Do
- Use database UUIDs as user IDs
- Create sessions per request
- Validate user IDs
- Implement proper authentication
- Test user isolation

### ❌ Don't
- Use `'default'` in production
- Share sessions between users
- Store user IDs in client code
- Use predictable user IDs
- Skip authentication

## Architecture

```
User Request
    ↓
Authentication Middleware
    ↓
Create Composio Session (user-specific)
    ↓
Get User Tools
    ↓
Create Agent (user-specific)
    ↓
Execute Action
    ↓
Return Response
```

## User Isolation

Each user has:
- ✅ Separate connections
- ✅ Independent authentication
- ✅ Isolated tool execution
- ✅ Private data access
- ✅ Individual rate limits

## Testing Checklist

- [ ] Create sessions for multiple users
- [ ] Verify user isolation
- [ ] Test connection management
- [ ] Check toolkit availability
- [ ] Test agent creation
- [ ] Verify tool execution
- [ ] Test error handling
- [ ] Check rate limiting

## Production Deployment

### 1. Replace Mock Authentication
```javascript
// Replace this:
const userId = req.headers['x-user-id'];

// With real auth:
const userId = req.session.userId; // or JWT, OAuth, etc.
```

### 2. Use Real Database
```javascript
// Replace in-memory store:
const users = new Map();

// With database:
const user = await db.users.findById(userId);
```

### 3. Add Session Caching
```javascript
// Cache sessions for performance
const sessionCache = new Map();

async function getSession(userId) {
  if (sessionCache.has(userId)) {
    return sessionCache.get(userId);
  }
  const session = await composio.create(userId);
  sessionCache.set(userId, session);
  return session;
}
```

### 4. Implement Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each user to 100 requests per windowMs
  keyGenerator: (req) => req.user.id,
});

app.use('/api/', limiter);
```

### 5. Add Logging
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log session creation
logger.info('Session created', { userId, timestamp: new Date() });
```

## Resources

- **[MULTI_USER_GUIDE.md](../MULTI_USER_GUIDE.md)** - Complete guide
- **[Composio Docs](https://docs.composio.dev/docs/users-and-sessions)** - Official docs
- **[multi-user-github-agent.js](../apps/agents/src/multi-user-github-agent.js)** - Agent implementation

## Support

For issues or questions:
1. Check the [MULTI_USER_GUIDE.md](../MULTI_USER_GUIDE.md)
2. Review Composio documentation
3. Test with the provided examples
4. Check server logs for errors

## Next Steps

1. ✅ Run test script to verify setup
2. ✅ Start multi-user server
3. ✅ Test with multiple users
4. 🔄 Implement in your app
5. 🚀 Deploy to production

---

**Ready to test?** Run the test script:
```bash
node examples/test-multi-user.js
```
