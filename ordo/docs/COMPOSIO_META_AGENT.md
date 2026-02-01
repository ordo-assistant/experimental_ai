# 🎯 Composio Meta Agent - Dynamic Access to 800+ Toolkits

## Overview

**Composio Meta Agent** menggunakan Meta Tools untuk memberikan akses dinamis ke **800+ toolkits** tanpa perlu pre-load semua tools. Agent ini secara cerdas menemukan, mengautentikasi, dan mengeksekusi tools yang tepat saat runtime.

## 🚀 What Are Meta Tools?

Meta Tools adalah 5 tools khusus yang memungkinkan agent untuk:
1. **Discover** tools yang relevan
2. **Authenticate** dengan services
3. **Execute** tools secara parallel
4. **Process** hasil yang besar

### The 5 Meta Tools

#### 1. COMPOSIO_SEARCH_TOOLS 🔍
**Discover relevant tools across 800+ apps**

Returns:
- Tools dengan schemas lengkap
- Connection status (sudah auth atau belum)
- Execution plan dan tips
- Related tools (prerequisites, alternatives)

Example:
```
User: "I need to create a GitHub issue"
↓
Agent calls COMPOSIO_SEARCH_TOOLS
↓
Returns:
- GITHUB_CREATE_ISSUE tool
- Input schema (title, body, labels, etc.)
- Connection status: "not connected"
- Execution plan: "First authenticate, then create issue"
```

#### 2. COMPOSIO_MANAGE_CONNECTIONS 🔐
**Handle OAuth and API key authentication**

Features:
- Generate auth links
- Manage user connections
- Check connection status
- Handle OAuth flow

Example:
```
Agent: "User needs to connect GitHub"
↓
Calls COMPOSIO_MANAGE_CONNECTIONS
↓
Returns: "Visit https://platform.composio.dev/connect/github"
↓
User authenticates
↓
Connection established
```

#### 3. COMPOSIO_MULTI_EXECUTE_TOOL ⚡
**Execute up to 20 tools in parallel**

Features:
- Parallel execution
- Batch operations
- Automatic error handling
- Result aggregation

Example:
```
Agent: "Create 5 GitHub issues"
↓
Calls COMPOSIO_MULTI_EXECUTE_TOOL with 5 tool calls
↓
Executes all in parallel
↓
Returns all results
```

#### 4. COMPOSIO_REMOTE_WORKBENCH 🐍
**Run Python code in persistent sandbox**

Use for:
- Bulk operations (label 100 emails)
- Complex data transformations
- Result analysis
- Helper functions with `invoke_llm`

Example:
```python
# Process large dataset
import pandas as pd
df = pd.DataFrame(results)
filtered = df[df['status'] == 'open']
summary = filtered.groupby('label').count()
```

#### 5. COMPOSIO_REMOTE_BASH_TOOL 💻
**Execute bash commands for file and data processing**

Tools available:
- `jq` - JSON processing
- `awk` - Text processing
- `sed` - Stream editing
- `grep` - Pattern matching

Example:
```bash
# Extract specific fields from JSON
cat data.json | jq '.items[] | {name, status}'

# Process CSV
awk -F',' '{print $1,$3}' data.csv
```

## 🌐 Available Toolkits (800+)

### Productivity
- **GitHub**: Issues, PRs, repos, actions
- **Gmail**: Send, read, search, labels
- **Google Calendar**: Events, meetings
- **Google Drive**: Files, folders, sharing
- **Google Sheets**: Read, write, formulas
- **Google Docs**: Create, edit, format

### Project Management
- **Jira**: Issues, projects, sprints
- **Asana**: Tasks, projects, teams
- **Trello**: Boards, cards, lists
- **Monday**: Boards, items, updates
- **Linear**: Issues, projects, cycles
- **Notion**: Pages, databases, blocks

### Communication
- **Slack**: Messages, channels, users
- **Discord**: Messages, servers, roles
- **Telegram**: Messages, groups, bots
- **Microsoft Teams**: Chats, channels
- **Zoom**: Meetings, recordings

### CRM & Sales
- **Salesforce**: Leads, opportunities, accounts
- **HubSpot**: Contacts, deals, companies
- **Zendesk**: Tickets, users, organizations
- **Intercom**: Messages, users, conversations

### Development
- **GitLab**: Repos, issues, MRs
- **Bitbucket**: Repos, PRs, pipelines
- **Jenkins**: Jobs, builds, pipelines
- **CircleCI**: Workflows, jobs
- **Docker Hub**: Images, repos

### Marketing
- **Mailchimp**: Campaigns, lists, subscribers
- **SendGrid**: Emails, templates
- **Twitter**: Tweets, DMs, followers
- **LinkedIn**: Posts, connections
- **Facebook**: Posts, pages, ads

### Finance
- **Stripe**: Payments, subscriptions, customers
- **PayPal**: Transactions, invoices
- **QuickBooks**: Invoices, expenses
- **Xero**: Accounting, invoices

### Storage & Files
- **Dropbox**: Files, folders, sharing
- **OneDrive**: Files, folders, sync
- **Box**: Files, folders, collaboration
- **AWS S3**: Buckets, objects

### Analytics
- **Google Analytics**: Reports, metrics
- **Mixpanel**: Events, funnels
- **Amplitude**: Analytics, cohorts
- **Segment**: Events, tracking

**And 760+ more toolkits!**

## 🎯 How It Works

### Example Flow: Create GitHub Issue

```
1. User: "Create a GitHub issue for bug XYZ"
   ↓
2. Agent calls COMPOSIO_SEARCH_TOOLS
   Query: "create github issue"
   ↓
   Returns:
   - Tool: GITHUB_CREATE_ISSUE
   - Schema: {title, body, labels, assignees}
   - Status: "not connected"
   - Plan: "Authenticate first, then create"
   ↓
3. Agent calls COMPOSIO_MANAGE_CONNECTIONS
   Toolkit: "github"
   ↓
   Returns: Auth link
   ↓
4. User clicks link and authenticates
   ↓
5. Agent calls COMPOSIO_MULTI_EXECUTE_TOOL
   Tool: GITHUB_CREATE_ISSUE
   Args: {
     title: "Bug XYZ",
     body: "Description...",
     labels: ["bug"]
   }
   ↓
   Returns: Created issue details
   ↓
6. Done! Issue created successfully
```

### Example Flow: Bulk Email Processing

```
1. User: "Label all unread emails from boss@company.com as 'urgent'"
   ↓
2. Agent calls COMPOSIO_SEARCH_TOOLS
   Query: "gmail search and label emails"
   ↓
3. Agent calls COMPOSIO_MULTI_EXECUTE_TOOL
   Tool: GMAIL_SEARCH_EMAILS
   ↓
   Returns: 50 emails (large result)
   ↓
4. Agent calls COMPOSIO_REMOTE_WORKBENCH
   Code:
   ```python
   # Process 50 emails
   for email in emails:
       if email['from'] == 'boss@company.com':
           label_email(email['id'], 'urgent')
   ```
   ↓
5. Done! All emails labeled
```

## 💡 Example Queries

### Discovery
```
"What tools are available for GitHub?"
"Search for tools to send emails"
"Find tools for Slack messaging"
"What can I do with Google Calendar?"
"Show me all CRM tools"
```

### Authentication
```
"Connect my GitHub account"
"Authenticate with Gmail"
"Set up Slack integration"
"Link my Google Drive"
```

### Execution
```
"Create a GitHub issue titled 'Bug fix needed'"
"Send an email to team@company.com"
"Post 'Hello' to #general on Slack"
"Create a Google Calendar event for tomorrow"
"Add a task to my Asana project"
```

### Bulk Operations
```
"Label all unread emails as 'to-review'"
"Create 10 GitHub issues from this list"
"Send the same email to 50 people"
"Update all Jira tickets with status 'done'"
```

### Complex Workflows
```
"When I get an email from boss@company.com, create a Slack message and a Jira ticket"
"Every day at 9am, send me a summary of GitHub issues"
"When a PR is merged, post to Slack and update Linear"
```

## 🔧 Setup

### Prerequisites

Already configured in `.env`:
```bash
COMPOSIO_API_KEY=ak_2JeDzAOXHR1XLQyiHoIc
CEREBRAS_API_KEY=csk-jw6jn9ytdrm3p4x5ffhw58tyf4f4ym5xx82jh9d86pm63xf9
```

### Quick Start

```bash
# 1. Start server
cd ordo
pnpm dev

# 2. Open Studio
# https://smith.langchain.com/studio?baseUrl=http://localhost:2024

# 3. Select: composio_meta

# 4. Try queries!
```

## 🎯 Use Cases

### 1. **Developer Productivity**
```
"Create GitHub issue and link to Jira ticket"
"When PR is approved, merge and deploy"
"Send daily standup summary to Slack"
```

### 2. **Email Management**
```
"Label all emails from clients as 'client'"
"Forward important emails to Slack"
"Create tasks from emails with 'TODO'"
```

### 3. **Project Management**
```
"Create Jira tickets from GitHub issues"
"Update Asana tasks when Slack messages arrive"
"Generate weekly project report"
```

### 4. **Customer Support**
```
"Create Zendesk ticket from email"
"Update HubSpot contact when ticket closes"
"Send follow-up email after ticket resolution"
```

### 5. **Marketing Automation**
```
"Post to Twitter and LinkedIn simultaneously"
"Send Mailchimp campaign to new subscribers"
"Track campaign performance in Google Analytics"
```

### 6. **Sales Operations**
```
"Create Salesforce lead from form submission"
"Update HubSpot deal when email is sent"
"Generate sales report from CRM data"
```

## 🆚 Comparison with Other Agents

| Feature | github_agent | composio_meta |
|---------|--------------|---------------|
| **Tools** | 6 GitHub tools | 800+ toolkits |
| **Pre-loaded** | Yes | No (dynamic) |
| **Discovery** | No | Yes |
| **Auth Handling** | Manual | Automatic |
| **Parallel Execution** | No | Yes (20 tools) |
| **Bulk Operations** | No | Yes (workbench) |
| **Best For** | GitHub only | Any service |

## 🔐 Authentication

### OAuth Flow

1. Agent detects tool needs auth
2. Calls `COMPOSIO_MANAGE_CONNECTIONS`
3. Returns auth link
4. User authenticates
5. Connection stored
6. Tools execute with user's permissions

### Supported Auth Methods

- OAuth 2.0
- API Keys
- Basic Auth
- Custom auth

### Managing Connections

Visit: https://platform.composio.dev/apps

- View all connections
- Reconnect expired auths
- Revoke access
- Add new integrations

## 💪 Advanced Features

### Parallel Execution

Execute multiple tools simultaneously:
```
"Create 5 GitHub issues, send 3 emails, and post to Slack"
↓
All executed in parallel (up to 20 tools)
```

### Python Workbench

Process complex data:
```python
# Analyze 1000 emails
import pandas as pd
from collections import Counter

# Load emails
emails = get_emails(limit=1000)

# Analyze
df = pd.DataFrame(emails)
top_senders = Counter(df['from']).most_common(10)
urgent_count = len(df[df['subject'].contains('URGENT')])

# Generate report
report = f"Top senders: {top_senders}\nUrgent emails: {urgent_count}"
```

### Bash Processing

Process files and data:
```bash
# Extract data from JSON
cat emails.json | jq '.[] | select(.unread==true) | .subject'

# Process CSV
awk -F',' '$3 > 100 {print $1,$2}' sales.csv | sort -nr

# Search logs
grep -i "error" app.log | wc -l
```

## 📊 Benefits

### vs Pre-loading All Tools

| Approach | Context Size | Discovery | Flexibility |
|----------|--------------|-----------|-------------|
| **Pre-load all** | Huge (800+ tools) | No | Limited |
| **Meta Tools** | Small (5 tools) | Yes | Unlimited |

### Advantages

1. **Minimal Context**: Only 5 meta tools loaded
2. **Dynamic Discovery**: Find tools at runtime
3. **Automatic Auth**: Handle authentication automatically
4. **Parallel Execution**: Run 20 tools simultaneously
5. **Large Results**: Process with workbench
6. **800+ Toolkits**: Access any service
7. **Always Updated**: New tools available immediately

## 🐛 Troubleshooting

### "Tool not found"
**Solution**: Use `COMPOSIO_SEARCH_TOOLS` to discover available tools

### "Authentication required"
**Solution**: Use `COMPOSIO_MANAGE_CONNECTIONS` to get auth link

### "Connection expired"
**Solution**: Reconnect at https://platform.composio.dev/apps

### "Rate limit exceeded"
**Solution**: Wait or upgrade Composio plan

## 📚 Resources

### Documentation
- **Composio Docs**: https://docs.composio.dev
- **Tools & Toolkits**: https://docs.composio.dev/docs/tools-and-toolkits
- **Authentication**: https://docs.composio.dev/docs/authentication
- **Browse Toolkits**: https://composio.dev/toolkits

### Platform
- **Dashboard**: https://platform.composio.dev
- **Apps**: https://platform.composio.dev/apps
- **API Keys**: https://platform.composio.dev/settings

## 🎓 Learning Path

### Day 1: Discovery
```
"What tools are available for GitHub?"
"Search for email tools"
"Find Slack tools"
```

### Day 2: Authentication
```
"Connect my GitHub account"
"Authenticate with Gmail"
"Set up Slack"
```

### Day 3: Basic Execution
```
"Create a GitHub issue"
"Send an email"
"Post to Slack"
```

### Day 4: Bulk Operations
```
"Label 50 emails"
"Create 10 issues"
"Send to 20 people"
```

### Day 5: Complex Workflows
```
"Email → Slack → Jira workflow"
"Automated daily reports"
"Multi-service integrations"
```

## 🚀 Quick Reference

### Discovery
```javascript
COMPOSIO_SEARCH_TOOLS({
  query: "create github issue",
  limit: 10
})
```

### Authentication
```javascript
COMPOSIO_MANAGE_CONNECTIONS({
  toolkit: "github",
  action: "connect"
})
```

### Execution
```javascript
COMPOSIO_MULTI_EXECUTE_TOOL({
  tools: [
    {
      name: "GITHUB_CREATE_ISSUE",
      args: {title: "Bug", body: "Fix this"}
    }
  ]
})
```

### Workbench
```javascript
COMPOSIO_REMOTE_WORKBENCH({
  code: "print('Hello from Python!')"
})
```

### Bash
```javascript
COMPOSIO_REMOTE_BASH_TOOL({
  command: "ls -la | grep .json"
})
```

## 🎉 Summary

**Composio Meta Agent** memberikan akses dinamis ke **800+ toolkits** dengan:

- ✅ 5 Meta Tools untuk discovery & execution
- ✅ 800+ toolkits tersedia
- ✅ Dynamic tool discovery
- ✅ Automatic authentication
- ✅ Parallel execution (20 tools)
- ✅ Python workbench untuk bulk ops
- ✅ Bash tools untuk data processing
- ✅ Minimal context overhead
- ✅ Always up-to-date

**Ready to access 800+ services?** 🎯

Open Studio and select `composio_meta`:
```
https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```

---

**Note:** Meta Agent adalah cara paling efisien untuk mengakses Composio toolkits. Tidak perlu pre-load semua tools - discover dan execute secara dinamis!
