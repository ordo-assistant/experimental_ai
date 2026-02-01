/**
 * Configuration Management
 * Centralized environment variable and configuration handling
 */

import 'dotenv/config';

export interface Config {
  // LangSmith
  langsmith: {
    apiKey: string;
    tracing: boolean;
    project: string;
  };

  // LLM Providers
  llm: {
    cerebras: {
      apiKey: string;
      model: string;
    };
    openai: {
      apiKey: string;
    };
    anthropic: {
      apiKey: string;
    };
    openrouter: {
      apiKey: string;
    };
  };

  // Composio
  composio: {
    apiKey: string;
  };

  // Search
  search: {
    tavily: {
      apiKey: string;
    };
    serper: {
      apiKey: string;
    };
    brave: {
      apiKey: string;
      aiApiKey: string;
    };
  };

  // Blockchain
  blockchain: {
    helius: {
      apiKey: string;
      rpcUrl: string;
      secureRpcUrl: string;
    };
    solana: {
      privateKey: string;
      rpcUrl: string;
    };
    jupiter: {
      apiKey: string;
      basicApiUrl: string;
      ultraApiUrl: string;
    };
  };
}

/**
 * Get configuration from environment variables
 */
export const config: Config = {
  langsmith: {
    apiKey: process.env.LANGSMITH_API_KEY || '',
    tracing: process.env.LANGSMITH_TRACING === 'true',
    project: process.env.LANGSMITH_PROJECT || 'Ordo-Ai',
  },

  llm: {
    cerebras: {
      apiKey: process.env.CEREBRAS_API_KEY || '',
      model: 'llama-3.3-70b',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    },
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY || '',
    },
  },

  composio: {
    apiKey: process.env.COMPOSIO_API_KEY || '',
  },

  search: {
    tavily: {
      apiKey: process.env.TAVILY_API_KEY || '',
    },
    serper: {
      apiKey: process.env.SERPER_API_KEY || '',
    },
    brave: {
      apiKey: process.env.BRAVE_SEARCH_API_KEY || '',
      aiApiKey: process.env.BRAVE_AI_API_KEY || '',
    },
  },

  blockchain: {
    helius: {
      apiKey: process.env.HELIUS_API_KEY || '',
      rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
      secureRpcUrl: process.env.HELIUS_SECURE_RPC_URL || '',
    },
    solana: {
      privateKey: process.env.SOLANA_PRIVATE_KEY || '',
      rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
    },
    jupiter: {
      apiKey: process.env.JUPITER_API_KEY || '',
      basicApiUrl: process.env.JUPITER_BASIC_API_URL || 'https://api.jup.ag',
      ultraApiUrl: process.env.JUPITER_ULTRA_API_URL || 'https://api.jup.ag/ultra',
    },
  },
};

/**
 * Validate required configuration
 */
export function validateConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  // Check required keys
  if (!config.langsmith.apiKey) missing.push('LANGSMITH_API_KEY');
  if (!config.llm.cerebras.apiKey) missing.push('CEREBRAS_API_KEY');
  if (!config.composio.apiKey) missing.push('COMPOSIO_API_KEY');

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get configuration value safely
 */
export function getConfig<T>(path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let value: any = config;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key not found: ${path}`);
    }
  }

  return value as T;
}

export default config;
