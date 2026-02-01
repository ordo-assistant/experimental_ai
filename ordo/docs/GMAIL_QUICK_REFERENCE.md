# Gmail Integration - Quick Reference

## Overview

Gmail toolkit is already available through your Composio Meta Agent. You can access all 23 Gmail tools dynamically without additional configuration.

## Available Through

- **composio_meta** agent - Dynamic tool discovery and execution
- **github_agent** - Can be extended to include Gmail tools

## Gmail Toolkit Summary

- **Category**: Collaboration & Communication
- **Authentication**: OAuth2
- **Tools**: 23 actions
- **Triggers**: 2 event listeners
- **Slug**: `GMAIL`

## Common Use Cases

### 1. Email Management

**Send Email**
```typescript
// Query: "Send an email to john@example.com with subject 'Meeting' and body 'Let's meet tomorrow'"
Tool: GMAIL_SEND_EMAIL
Parameters:
- recipient_email: "john@example.com"
- subject: "Meeting"
- body: "Let's meet tomorrow"
- is_html: false
```

**Fetch Emails**
```typescript
// Query: "Get my unread emails from inbox"
Tool: GMAIL_FETCH_EMAILS
Parameters:
- label_ids: ["INBOX", "UNREAD"]
- max_results: 10
- include_payload: true
```

**Reply to Thread**
```typescript
// Query: "Reply to thread abc123 with message 'Thanks for the update'"
Tool: GMAIL_REPLY_TO_THREAD
Parameters:
- thread_id: "abc123"
- recipient_email: "sender@example.com"
- message_body: "Thanks for the update"
```

### 2. Label Management

**List Labels**
```typescript
// Query: "Show me all my Gmail labels"
Tool: GMAIL_LIST_LABELS
Parameters:
- user_id: "me"
```

**Create Label**
```typescript
// Query: "Create a label called 'Important Projects'"
Tool: GMAIL_CREATE_LABEL
Parameters:
- label_name: "Important Projects"
- background_color: "#FF0000"
- text_color: "#FFFFFF"
```

**Modify Email Labels**
```typescript
// Query: "Add 'Important' label to message xyz789"
Tool: GMAIL_ADD_LABEL_TO_EMAIL
Parameters:
- message_id: "xyz789"
- add_label_ids: ["IMPORTANT"]
```

### 3. Draft Management

**Create Draft**
```typescript
// Query: "Create a draft email to team@company.com about the project update"
Tool: GMAIL_CREATE_EMAIL_DRAFT
Parameters:
- recipient_email: "team@company.com"
- subject: "Project Update"
- body: "Here's the latest update..."
```

**List Drafts**
```typescript
// Query: "Show me all my email drafts"
Tool: GMAIL_LIST_DRAFTS
Parameters:
- user_id: "me"
- verbose: true
- max_results: 20
```

**Send Draft**
```typescript
// Query: "Send draft with ID draft123"
Tool: GMAIL_SEND_DRAFT
Parameters:
- draft_id: "draft123"
```

### 4. Search & Filter

**Advanced Search**
```typescript
// Query: "Find emails from boss@company.com with attachments from last week"
Tool: GMAIL_FETCH_EMAILS
Parameters:
- query: "from:boss@company.com has:attachment after:2026/01/25"
- max_results: 50
```

**Search by Labels**
```typescript
// Query: "Get all starred emails from primary category"
Tool: GMAIL_FETCH_EMAILS
Parameters:
- label_ids: ["STARRED", "CATEGORY_PRIMARY"]
- include_payload: true
```

### 5. Contacts Management

**Get Contacts**
```typescript
// Query: "Show me all my Google contacts"
Tool: GMAIL_GET_CONTACTS
Parameters:
- person_fields: "names,emailAddresses,phoneNumbers"
- include_other_contacts: true
```

**Search People**
```typescript
// Query: "Find contacts named John"
Tool: GMAIL_SEARCH_PEOPLE
Parameters:
- query: "John"
- person_fields: "names,emailAddresses"
```

### 6. Attachments

**Get Attachment**
```typescript
// Query: "Download attachment att123 from message msg456"
Tool: GMAIL_GET_ATTACHMENT
Parameters:
- message_id: "msg456"
- attachment_id: "att123"
- file_name: "document.pdf"
```

**Send Email with Attachment**
```typescript
// Query: "Send email with attachment to client@example.com"
Tool: GMAIL_SEND_EMAIL
Parameters:
- recipient_email: "client@example.com"
- subject: "Document"
- body: "Please find attached"
- attachment: { path: "/path/to/file.pdf" }
```

## Gmail Search Query Syntax

### Common Operators

- `from:email@domain.com` - From specific sender
- `to:email@domain.com` - To specific recipient
- `subject:keyword` - Subject contains keyword
- `label:inbox` - Has specific label
- `is:unread` - Unread messages
- `is:starred` - Starred messages
- `has:attachment` - Has attachments
- `after:YYYY/MM/DD` - After date
- `before:YYYY/MM/DD` - Before date
- `newer_than:7d` - Newer than 7 days
- `older_than:1m` - Older than 1 month

### Combining Operators

- `AND` - Both conditions must match
- `OR` - Either condition matches
- `NOT` or `-` - Exclude condition
- `()` - Group conditions

### Examples

```
from:boss@company.com subject:urgent
from:client@example.com has:attachment after:2026/01/01
is:unread label:inbox -label:spam
(from:john OR from:jane) subject:meeting
```

## System Labels

- `INBOX` - Inbox messages
- `SPAM` - Spam folder
- `TRASH` - Trash folder
- `UNREAD` - Unread messages
- `STARRED` - Starred messages
- `IMPORTANT` - Important messages
- `SENT` - Sent messages
- `DRAFT` - Draft messages
- `CATEGORY_PRIMARY` - Primary category
- `CATEGORY_SOCIAL` - Social category
- `CATEGORY_PROMOTIONS` - Promotions category
- `CATEGORY_UPDATES` - Updates category
- `CATEGORY_FORUMS` - Forums category

## Triggers

### 1. Email Sent Trigger

Monitors when emails are sent by the authenticated user.

```typescript
Trigger: GMAIL_EMAIL_SENT_TRIGGER
Configuration:
- interval: 5 (check every 5 minutes)
- query: "to:important@client.com" (optional filter)
- userId: "me"

Payload:
- message_id
- thread_id
- sender
- recipients (to, cc, bcc)
- subject
- message_timestamp
```

### 2. New Message Received Trigger

Monitors when new emails are received.

```typescript
Trigger: GMAIL_NEW_GMAIL_MESSAGE
Configuration:
- interval: 5 (check every 5 minutes)
- labelIds: "INBOX" (optional)
- query: "from:boss@company.com is:unread" (optional)
- userId: "me"

Payload:
- message_id
- thread_id
- sender
- to
- subject
- message_text
- message_timestamp
- attachment_list
```

## Using with Composio Meta Agent

### Example Queries

**Simple Email Operations**
```
"Send an email to john@example.com saying hello"
"Get my last 10 unread emails"
"Create a draft to team@company.com about the meeting"
"Reply to thread abc123 with 'Sounds good'"
```

**Advanced Operations**
```
"Find all emails from boss@company.com with attachments from last week"
"Create a label called 'Q1 Reports' and add it to all emails with subject containing 'Q1'"
"Get all starred emails from primary category and list their subjects"
"Search my contacts for anyone named Sarah"
```

**Bulk Operations**
```
"Label all unread emails from client@example.com as 'Important'"
"Move all emails older than 30 days from promotions to trash"
"Create drafts for all contacts in my 'Sales Team' group"
```

## Authentication

Gmail uses OAuth2 authentication through Composio:

1. **First Time Setup**
   ```bash
   # The agent will prompt for authorization
   # Follow the OAuth flow in your browser
   # Grant Gmail permissions
   ```

2. **Permissions Required**
   - Read emails
   - Send emails
   - Modify labels
   - Manage drafts
   - Access contacts

3. **Token Management**
   - Tokens are managed by Composio
   - Automatic refresh
   - Secure storage

## Best Practices

### 1. Use Specific Queries
```typescript
// Good
query: "from:boss@company.com subject:urgent is:unread"

// Too broad
query: "email"
```

### 2. Limit Results
```typescript
// Always set max_results for large queries
max_results: 50
```

### 3. Use Pagination
```typescript
// For large result sets
page_token: "next_page_token_from_previous_response"
```

### 4. Optimize Payload
```typescript
// Only fetch full payload when needed
include_payload: false  // For listing
include_payload: true   // For reading content
```

### 5. Use Verbose Wisely
```typescript
// Fast listing
verbose: false

// Detailed information
verbose: true
```

## Error Handling

### Common Errors

1. **Invalid Message ID**
   - Ensure message exists
   - Check user has access

2. **Invalid Label ID**
   - Use GMAIL_LIST_LABELS to get valid IDs
   - System labels are uppercase

3. **Authentication Failed**
   - Re-authorize OAuth
   - Check token expiration

4. **Rate Limits**
   - Implement exponential backoff
   - Batch operations when possible

## Integration Examples

### Example 1: Email Automation

```typescript
// Query: "Check for unread emails from VIP clients and create tasks"

1. Fetch emails:
   GMAIL_FETCH_EMAILS
   - query: "from:vip@client.com is:unread"
   
2. For each email:
   - Extract subject and body
   - Create task in project management tool
   - Mark as read (remove UNREAD label)
   - Add "Processed" label
```

### Example 2: Email Digest

```typescript
// Query: "Create a daily digest of important emails"

1. Fetch emails:
   GMAIL_FETCH_EMAILS
   - label_ids: ["IMPORTANT", "INBOX"]
   - query: "newer_than:1d"
   
2. Format digest:
   - Group by sender
   - Include subject and snippet
   - Add links to threads
   
3. Send digest:
   GMAIL_SEND_EMAIL
   - recipient_email: "me"
   - subject: "Daily Email Digest"
   - body: formatted_digest
```

### Example 3: Smart Labeling

```typescript
// Query: "Auto-label emails based on content"

1. Fetch new emails:
   GMAIL_FETCH_EMAILS
   - label_ids: ["INBOX", "UNREAD"]
   
2. Analyze content:
   - Check subject and body
   - Identify keywords
   - Determine category
   
3. Apply labels:
   GMAIL_ADD_LABEL_TO_EMAIL
   - message_id: email_id
   - add_label_ids: [determined_labels]
```

## Testing

### Test Queries

```bash
# Start the agent
cd ordo
pnpm dev

# Open Studio
# https://smith.langchain.com/studio?baseUrl=http://localhost:2024

# Select: composio_meta

# Test queries:
1. "What Gmail tools are available?"
2. "Get my last 5 emails from inbox"
3. "Create a label called 'Test Label'"
4. "Send a test email to myself"
5. "List all my Gmail labels"
```

## Resources

- **Composio Gmail Docs**: https://docs.composio.dev/apps/gmail
- **Gmail API Docs**: https://developers.google.com/gmail/api
- **OAuth2 Setup**: https://docs.composio.dev/authentication
- **Search Syntax**: https://support.google.com/mail/answer/7190

## Summary

The Gmail toolkit provides comprehensive email management capabilities through your Composio Meta Agent:

- ✅ 23 tools for email operations
- ✅ 2 triggers for event monitoring
- ✅ OAuth2 authentication
- ✅ Advanced search and filtering
- ✅ Label and draft management
- ✅ Contact integration
- ✅ Attachment handling

Use the Composio Meta Agent to dynamically discover and execute Gmail tools based on natural language queries.

---

**Last Updated**: February 1, 2026
**Toolkit Version**: 20260128_00
**Agent**: composio_meta
