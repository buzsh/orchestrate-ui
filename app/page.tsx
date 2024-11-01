"use client";

import { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import { sampleWorkflows, sampleAgents } from "@/data/sampleAgentData";
import { Agent, Workflow } from "@/data/types";

export default function Home() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [agents, setAgents] = useState(sampleAgents);
  const [workflows, setWorkflows] = useState(sampleWorkflows);

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: workflows.length + 1,
      name: `New Workflow ${workflows.length + 1}`,
      description: "A new workflow",
      agents: [],
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflowId(newWorkflow.id);
  };

  const handleCreateAgent = () => {
    const newAgent: Agent = {
      id: agents.length + 1,
      name: `New Agent ${agents.length + 1}`,
      description: "A new AI agent",
      role: "assistant",
      systemPrompt: "You are a helpful AI assistant.",
      temperature: 0.7,
      model: "gpt-4",
      workflows: selectedWorkflowId ? [workflows.find(w => w.id === selectedWorkflowId)!] : [],
      conversations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAgents([...agents, newAgent]);
    
    // If we're in a workflow, add the agent to it
    if (selectedWorkflowId) {
      setWorkflows(workflows.map(workflow => {
        if (workflow.id === selectedWorkflowId) {
          return {
            ...workflow,
            agents: [...workflow.agents, newAgent],
          };
        }
        return workflow;
      }));
    }
    
    setSelectedAgentId(newAgent.id);
  };

  const handleSaveAgent = (updatedAgent: Agent) => {
    setAgents(agents.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    ));

    // Update the agent in any workflows it belongs to
    setWorkflows(workflows.map(workflow => ({
      ...workflow,
      agents: workflow.agents.map(agent =>
        agent.id === updatedAgent.id ? updatedAgent : agent
      ),
    })));
  };

  const selectedWorkflow = selectedWorkflowId 
    ? workflows.find(w => w.id === selectedWorkflowId)
    : null;

  const filteredAgents = selectedWorkflow
    ? agents.filter(agent => agent.workflows.some(w => w.id === selectedWorkflowId))
    : agents;

  const selectedAgent = selectedAgentId 
    ? agents.find(a => a.id === selectedAgentId) || null
    : null;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        workflows={workflows}
        selectedWorkflowId={selectedWorkflowId}
        onSelectWorkflow={setSelectedWorkflowId}
        onCreateWorkflow={handleCreateWorkflow}
      />
      <div className="flex flex-1 overflow-hidden">
        <AgentList
          agents={filteredAgents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          onCreateAgent={handleCreateAgent}
          selectedWorkflowName={selectedWorkflow?.name || null}
        />
        <DetailView
          agent={selectedAgent}
          onSave={handleSaveAgent}
        />
      </div>
    </div>
  );
}
