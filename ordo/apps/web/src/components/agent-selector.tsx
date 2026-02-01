import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Loader2 } from "lucide-react";

interface Agent {
  graph_id: string;
  description?: string;
  category?: string;
}

const AGENT_INFO: Record<string, { description: string; category: string; icon: string }> = {
  // Hierarchical Agents
  supervisor: {
    description: "Routes requests to specialized coordinators using GPT-4",
    category: "Hierarchical",
    icon: "🎯"
  },
  composio_coordinator: {
    description: "Manages Composio workers for 800+ app integrations",
    category: "Hierarchical",
    icon: "🔄"
  },
  web3_coordinator: {
    description: "Coordinates Web3 and blockchain operations",
    category: "Hierarchical",
    icon: "⛓️"
  },
  
  // Basic Agents
  simple_agent: {
    description: "Basic AI chat with Cerebras Llama 3.3 70B",
    category: "Basic",
    icon: "💬"
  },
  
  // Composio Agents
  composio_meta: {
    description: "Dynamic access to 800+ toolkits (GitHub, Gmail, Slack, etc.)",
    category: "Composio",
    icon: "🎯"
  },
  github_agent: {
    description: "GitHub operations via Composio",
    category: "Composio",
    icon: "🐙"
  },
  
  // LLM Agents
  openrouter_agent: {
    description: "Access to 200+ AI models via OpenRouter",
    category: "LLM",
    icon: "🤖"
  },
  openrouter_tools: {
    description: "AI models with tool calling capabilities",
    category: "LLM",
    icon: "🛠️"
  },
  
  // Search Agents
  tavily_agent: {
    description: "Web search and content extraction",
    category: "Search",
    icon: "🔍"
  },
  
  // Web3 Agents
  solana_agent: {
    description: "NFT queries and wallet operations",
    category: "Web3",
    icon: "🎨"
  },
  web3_agent: {
    description: "Solana DeFi operations (60+ tools)",
    category: "Web3",
    icon: "⚡"
  },
  godmode_agent: {
    description: "Advanced DeFi tools (40+ protocols)",
    category: "Web3",
    icon: "🎮"
  },
  ultimate_agent: {
    description: "All tools combined (150+ capabilities)",
    category: "Web3",
    icon: "🚀"
  },
  
  // Pre-built Agents
  agent: {
    description: "ReAct pattern (Reasoning and Acting)",
    category: "Pre-built",
    icon: "🧠"
  },
  memory_agent: {
    description: "Conversation memory management",
    category: "Pre-built",
    icon: "💾"
  },
  research_agent: {
    description: "Research task automation",
    category: "Pre-built",
    icon: "📚"
  },
  retrieval_agent: {
    description: "RAG pattern implementation",
    category: "Pre-built",
    icon: "📖"
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Hierarchical: "bg-purple-100 text-purple-800 border-purple-200",
  Basic: "bg-blue-100 text-blue-800 border-blue-200",
  Composio: "bg-green-100 text-green-800 border-green-200",
  LLM: "bg-orange-100 text-orange-800 border-orange-200",
  Search: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Web3: "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Pre-built": "bg-gray-100 text-gray-800 border-gray-200",
};

export function AgentSelector({ onSelect }: { onSelect: (agentId: string) => void }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available agents from the API
    fetch("http://localhost:2024/info")
      .then((res) => res.json())
      .then((data) => {
        const agentList = Object.keys(data).map((id) => ({
          graph_id: id,
          ...AGENT_INFO[id],
        }));
        setAgents(agentList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch agents:", err);
        // Fallback to hardcoded list
        const agentList = Object.keys(AGENT_INFO).map((id) => ({
          graph_id: id,
          ...AGENT_INFO[id],
        }));
        setAgents(agentList);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(agents.map((a) => a.category).filter(Boolean)));
  const filteredAgents = selectedCategory
    ? agents.filter((a) => a.category === selectedCategory)
    : agents;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Ordo Multi-Agent System
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Choose an AI agent to start your conversation
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Agents ({agents.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category} ({agents.filter((a) => a.category === category).length})
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.graph_id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
              onClick={() => onSelect(agent.graph_id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{AGENT_INFO[agent.graph_id]?.icon || "🤖"}</span>
                    <div>
                      <CardTitle className="text-lg">{agent.graph_id}</CardTitle>
                      {agent.category && (
                        <Badge
                          variant="outline"
                          className={`mt-2 ${CATEGORY_COLORS[agent.category] || ""}`}
                        >
                          {agent.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {agent.description || "No description available"}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            💡 Tip: Start with <strong>simple_agent</strong> for basic chat or{" "}
            <strong>composio_meta</strong> for advanced integrations
          </p>
        </div>
      </div>
    </div>
  );
}
