# 🔍 Helius Advanced Features Guide

## Overview

Panduan lengkap untuk menggunakan fitur-fitur advanced Helius, termasuk `getTransactionsForAddress` yang merupakan Helius-exclusive RPC method.

---

## 🚀 getTransactionsForAddress

### What Makes It Special

**Helius Exclusive Feature** - Tidak tersedia di standard Solana RPC!

**Key Advantages:**
- ✅ Get full transactions in ONE call (vs 100+ calls with standard RPC)
- ✅ Include token account transactions automatically
- ✅ Advanced filtering (time, status, slots)
- ✅ Bidirectional sorting (oldest first or newest first)
- ✅ Efficient pagination
- ✅ Transaction index for ordering

**Cost:** 100 credits per request
**Returns:** Up to 100 full transactions or 1,000 signatures

---

## 📋 Key Features

### 1. Flexible Sorting
```javascript
// Chronological (oldest first) - great for historical analysis
sortOrder: 'asc'

// Reverse chronological (newest first) - default
sortOrder: 'desc'
```

### 2. Advanced Filtering
```javascript
filters: {
  blockTime: { gte: 1735689600, lte: 1738368000 },  // Time range
  status: 'succeeded',                                // Only successful
  tokenAccounts: 'balanceChanged'                     // Include token txs
}
```

### 3. Full Transaction Data
```javascript
// Get complete transaction details in one call
transactionDetails: 'full'  // vs 'signatures'
```

### 4. Token Accounts Support
```javascript
// Include transactions for associated token accounts
tokenAccounts: 'balanceChanged'  // Recommended
// vs 'none' (default) or 'all'
```

---

## 🎯 Common Use Cases

### 1. Token Launch Analysis
Track first mint transactions and early holders:

```javascript
const response = await fetch(
  'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransactionsForAddress',
      params: [
        'MINT_ADDRESS',
        {
          transactionDetails: 'full',
          sortOrder: 'asc',  // Chronological from beginning
          limit: 10,
          encoding: 'jsonParsed',
          maxSupportedTransactionVersion: 0
        }
      ]
    })
  }
);

const data = await response.json();
const firstMint = data.result.data[0];
console.log('Token created at:', new Date(firstMint.blockTime * 1000));
console.log('Creator:', firstMint.transaction.message.accountKeys[0]);
```

### 2. Wallet Funding History
Find who funded a wallet:

```javascript
const response = await fetch(heliusRpcUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransactionsForAddress',
    params: [
      'TARGET_WALLET',
      {
        transactionDetails: 'full',
        sortOrder: 'asc',  // Oldest first
        limit: 10
      }
    ]
  })
});

const data = await response.json();
data.result.data.forEach(tx => {
  const balanceChanges = tx.meta.preBalances.map(
    (pre, i) => tx.meta.postBalances[i] - pre
  );
  
  balanceChanges.forEach((change, i) => {
    if (change > 0) {
      console.log(`Received ${change} lamports from ${
        tx.transaction.message.accountKeys[i]
      }`);
    }
  });
});
```

### 3. Transaction Analysis
Filter by success/failure:

```javascript
// Only successful transactions
const response = await fetch(heliusRpcUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransactionsForAddress',
    params: [
      'WALLET_ADDRESS',
      {
        transactionDetails: 'signatures',
        filters: {
          status: 'succeeded'  // or 'failed' or 'any'
        },
        limit: 1000
      }
    ]
  })
});
```

### 4. Time-Based Analytics
Generate monthly reports:

```javascript
// Get all transactions for January 2025
const startTime = Math.floor(new Date('2025-01-01').getTime() / 1000);
const endTime = Math.floor(new Date('2025-02-01').getTime() / 1000);

const response = await fetch(heliusRpcUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransactionsForAddress',
    params: [
      'WALLET_ADDRESS',
      {
        transactionDetails: 'signatures',
        filters: {
          blockTime: {
            gte: startTime,
            lt: endTime
          },
          status: 'succeeded'
        },
        limit: 1000
      }
    ]
  })
});

// Calculate daily stats
const dailyStats = {};
response.result.data.forEach(tx => {
  const date = new Date(tx.blockTime * 1000).toISOString().split('T')[0];
  dailyStats[date] = (dailyStats[date] || 0) + 1;
});

console.log('Daily Transaction Counts:', dailyStats);
```

### 5. Complete Token History
Get all token transactions in ONE call:

```javascript
// OLD WAY: Multiple calls to getSignaturesForAddress
// 1. Get token accounts
// 2. Query each token account
// 3. Merge and deduplicate
// 4. Sort
// = 10+ API calls!

// NEW WAY: One call with tokenAccounts filter
const response = await fetch(heliusRpcUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransactionsForAddress',
    params: [
      'WALLET_ADDRESS',
      {
        transactionDetails: 'full',
        filters: {
          tokenAccounts: 'balanceChanged'  // Include token txs
        },
        sortOrder: 'asc',
        limit: 100
      }
    ]
  })
});
```

---

## 🔧 Parameters

### Required
- **address** (string): Base-58 encoded public key

### Optional
- **transactionDetails** (string): `'signatures'` or `'full'`
- **sortOrder** (string): `'asc'` or `'desc'`
- **limit** (number): Up to 1000 (signatures) or 100 (full)
- **paginationToken** (string): For pagination
- **commitment** (string): `'finalized'` or `'confirmed'`
- **encoding** (string): `'json'`, `'jsonParsed'`, `'base64'`, `'base58'`
- **maxSupportedTransactionVersion** (number): Set to 0 for versioned txs

### Filters
- **filters.slot** (object): `{ gte, gt, lte, lt }`
- **filters.blockTime** (object): `{ gte, gt, lte, lt, eq }`
- **filters.signature** (object): `{ gte, gt, lte, lt }`
- **filters.status** (string): `'succeeded'`, `'failed'`, or `'any'`
- **filters.tokenAccounts** (string): `'none'`, `'balanceChanged'`, or `'all'`

---

## 📊 Comparison with Standard RPC

### getSignaturesForAddress (Standard)

**Problems:**
```javascript
// Step 1: Get signatures (1 call)
const sigs = await connection.getSignaturesForAddress(address);

// Step 2: Get full transactions (100 calls!)
const txs = await Promise.all(
  sigs.map(sig => connection.getTransaction(sig.signature))
);

// Step 3: For token history, query each token account
const tokenAccounts = await connection.getTokenAccountsByOwner(address);
const tokenTxs = await Promise.all(
  tokenAccounts.value.map(acc => 
    connection.getSignaturesForAddress(acc.pubkey)
  )
);

// Step 4: Merge, deduplicate, sort
// = 100+ API calls total!
```

### getTransactionsForAddress (Helius)

**Solution:**
```javascript
// ONE call gets everything!
const response = await fetch(heliusRpcUrl, {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransactionsForAddress',
    params: [
      address,
      {
        transactionDetails: 'full',
        filters: { tokenAccounts: 'balanceChanged' },
        limit: 100
      }
    ]
  })
});

// Done! Full transactions + token history
```

**Benefits:**
- ✅ 100x fewer API calls
- ✅ Faster response time
- ✅ Automatic token account inclusion
- ✅ Built-in filtering and sorting
- ✅ Simpler pagination

---

## 🔄 Pagination

### Simple Pagination Pattern

```javascript
async function getAllTransactions(address) {
  let allTransactions = [];
  let paginationToken = null;
  
  do {
    const params = [
      address,
      {
        transactionDetails: 'signatures',
        limit: 1000,
        ...(paginationToken && { paginationToken })
      }
    ];
    
    const response = await fetch(heliusRpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransactionsForAddress',
        params
      })
    });
    
    const data = await response.json();
    allTransactions.push(...data.result.data);
    paginationToken = data.result.paginationToken;
    
    console.log(`Fetched ${data.result.data.length} transactions`);
    console.log(`Total: ${allTransactions.length}`);
    
  } while (paginationToken);
  
  return allTransactions;
}
```

### Multiple Addresses

```javascript
async function getTransactionsForMultipleAddresses(addresses) {
  // Query all addresses in parallel
  const results = await Promise.all(
    addresses.map(address =>
      fetch(heliusRpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransactionsForAddress',
          params: [
            address,
            {
              sortOrder: 'desc',
              filters: { slot: { gt: 250000000 } }
            }
          ]
        })
      }).then(r => r.json())
    )
  );
  
  // Merge and sort by slot
  const allTransactions = results
    .flatMap(r => r.result.data)
    .sort((a, b) => b.slot - a.slot);
  
  return allTransactions;
}
```

---

## 💡 Best Practices

### 1. Use Appropriate Detail Level

```javascript
// For analytics: Use signatures (faster, more results)
transactionDetails: 'signatures'  // Up to 1000 results

// For full data: Use full (complete info)
transactionDetails: 'full'  // Up to 100 results
```

### 2. Filter Aggressively

```javascript
// Start broad, narrow down
filters: {
  blockTime: { gte: startTime, lte: endTime },  // Time range
  status: 'succeeded',                           // Only successful
  tokenAccounts: 'balanceChanged'                // Relevant tokens only
}
```

### 3. Use Chronological Order for Analysis

```javascript
// For historical replay
sortOrder: 'asc'  // Oldest first

// For recent activity
sortOrder: 'desc'  // Newest first (default)
```

### 4. Handle Pagination Efficiently

```javascript
// Store pagination token for resuming later
const state = {
  lastPaginationToken: paginationToken,
  processedCount: allTransactions.length
};

// Resume from saved state
const params = [
  address,
  {
    paginationToken: state.lastPaginationToken,
    limit: 1000
  }
];
```

### 5. Cache Results

```javascript
// Cache transaction data to reduce API calls
const cache = new Map();

async function getCachedTransactions(address, filters) {
  const cacheKey = `${address}:${JSON.stringify(filters)}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = await getTransactionsForAddress(address, filters);
  cache.set(cacheKey, result);
  
  return result;
}
```

---

## 🎯 Integration with Ordo Agents

### Update solana_agent.js

Your `solana_agent` can be enhanced with this feature:

```javascript
// Add to solana_agent.js tools
const getTransactionHistory = {
  name: 'get_transaction_history',
  description: 'Get complete transaction history for an address with advanced filtering',
  parameters: {
    address: { type: 'string', required: true },
    limit: { type: 'number', default: 100 },
    includeTokens: { type: 'boolean', default: true },
    onlySuccessful: { type: 'boolean', default: false },
    startDate: { type: 'string', optional: true },
    endDate: { type: 'string', optional: true }
  },
  execute: async ({ address, limit, includeTokens, onlySuccessful, startDate, endDate }) => {
    const filters = {};
    
    if (includeTokens) {
      filters.tokenAccounts = 'balanceChanged';
    }
    
    if (onlySuccessful) {
      filters.status = 'succeeded';
    }
    
    if (startDate || endDate) {
      filters.blockTime = {};
      if (startDate) filters.blockTime.gte = Math.floor(new Date(startDate).getTime() / 1000);
      if (endDate) filters.blockTime.lte = Math.floor(new Date(endDate).getTime() / 1000);
    }
    
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransactionsForAddress',
          params: [address, { transactionDetails: 'full', filters, limit }]
        })
      }
    );
    
    return await response.json();
  }
};
```

---

## 📚 Resources

### Documentation
- **Helius Docs**: https://www.helius.dev/docs
- **API Reference**: https://docs.helius.dev/api-reference/rpc/http/gettransactionsforaddress
- **LLMs.txt**: https://www.helius.dev/docs/llms.txt

### Support
- **Discord**: https://discord.com/invite/6GXdee3gBj
- **Support**: https://www.helius.dev/support

---

## 🎉 Summary

**getTransactionsForAddress** adalah game-changer untuk Solana transaction analysis:

- ✅ 100x fewer API calls
- ✅ Complete token history in one call
- ✅ Advanced filtering (time, status, slots)
- ✅ Bidirectional sorting
- ✅ Efficient pagination
- ✅ Transaction ordering with index
- ✅ Helius exclusive feature

**Your Helius API key is already configured!** 🎯

Start using this powerful feature in your Ordo agents for advanced transaction analysis.
