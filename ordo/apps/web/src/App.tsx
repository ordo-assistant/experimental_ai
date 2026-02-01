import "./App.css";
import { Thread } from "@/components/thread";
import { AgentSelector } from "@/components/agent-selector";
import { useState } from "react";
import { useQueryState } from "nuqs";

function App() {
  const [selectedAgent, setSelectedAgent] = useQueryState("assistantId");
  
  // Show agent selector if no agent is selected
  if (!selectedAgent) {
    return <AgentSelector onSelect={setSelectedAgent} />;
  }

  return <Thread />;
}

export default App;
