"use client";

import { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import { Agent, Workflow } from "@/data/types";
import { useQuery } from '@tanstack/react-query';
import { useCreateWorkflow, useUpdateWorkflow } from '@/hooks/useWorkflowMutations';
import { useCreateAgent, useUpdateAgent } from '@/hooks/useAgentMutations';

export default function Home() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  // Initialize mutations
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const createWorkflow = useCreateWorkflow();
  const updateWorkflow = useUpdateWorkflow();

  const { data: workflows = [], isLoading: isLoadingWorkflows } = useQuery<Workflow[]>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await fetch('/api/workflows');
      return response.json();
    },
  });

  const { data: agents = [], isLoading: isLoadingAgents } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents');
      return response.json();
    },
  });

  useEffect(() => {
    if (workflows?.length && selectedWorkflowId === null) {
      setSelectedWorkflowId(workflows[0].id);
    }
  }, [workflows, selectedWorkflowId]);

  const handleCreateWorkflow = async () => {
    const newWorkflow: Omit<Workflow, 'id'> = {
      name: `New Workflow ${workflows.length + 1}`,
      description: "A new workflow",
      agents: [],
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await createWorkflow.mutateAsync(newWorkflow);
  };

  const handleCreateAgent = async () => {
    const newAgent: Omit<Agent, 'id'> = {
      name: `New Agent ${agents.length + 1}`,
      description: "A new AI agent",
      role: "assistant",
      systemPrompt: "You are a helpful AI assistant.",
      temperature: 0.7,
      model: "gpt-4",
      workflows: selectedWorkflowId ? [workflows.find((w: Workflow) => w.id === selectedWorkflowId)!] : [],
      conversations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await createAgent.mutateAsync(newAgent);
  };

  const handleSaveAgent = async (updatedAgent: Agent) => {
    await updateAgent.mutateAsync(updatedAgent);
  };

  const handleWorkflowNameUpdate = async (name: string) => {
    if (!selectedWorkflow) return;
    
    const updatedWorkflow: Workflow = {
      ...selectedWorkflow,
      name,
      updatedAt: new Date().toISOString(),
    };
    
    await updateWorkflow.mutateAsync(updatedWorkflow);
  };

  const selectedWorkflow = selectedWorkflowId 
    ? workflows.find((w: Workflow) => w.id === selectedWorkflowId)
    : null;

  const filteredAgents = selectedWorkflow
    ? agents.filter((agent: Agent) => 
        agent.workflows.some((w: Workflow) => w.id === selectedWorkflowId)
      )
    : agents;

  const selectedAgent = selectedAgentId 
    ? agents.find((a: Agent) => a.id === selectedAgentId) || null
    : null;

  if (isLoadingWorkflows || isLoadingAgents) {
    return <div>Loading...</div>;
  }

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
          onSaveWorkflow={handleWorkflowNameUpdate}
        />
        <DetailView
          agent={selectedAgent}
          onSave={handleSaveAgent}
        />
      </div>
    </div>
  );
}
