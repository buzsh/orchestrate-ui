"use client";

import { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import { Agent, Workflow } from "@/data/types";
import MobileLayout from '@/components/MobileLayout';
import useIsMobile from '@/hooks/useIsMobile';
import { useWorkflowsQuery, useAgentsQuery, useMutations } from '@/lib/hooks/useData';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const { 
    data: workflows = [], 
    isLoading: isLoadingWorkflows,
    isFetching: isFetchingWorkflows,
    error: workflowsError 
  } = useWorkflowsQuery();
  
  const { 
    data: agents = [], 
    isLoading: isLoadingAgents,
    isFetching: isFetchingAgents,
    error: agentsError 
  } = useAgentsQuery();

  const {
    createWorkflow,
    updateWorkflow,
    createAgent,
    updateAgent
  } = useMutations();

  useEffect(() => {
    if (workflows?.length && selectedWorkflowId === null) {
      setSelectedWorkflowId(workflows[0]._id);
    }
  }, [workflows, selectedWorkflowId]);

  const handleCreateWorkflow = async () => {
    if (!user) return;
    
    const newWorkflow: Omit<Workflow, '_id'> = {
      name: `New Workflow ${workflows.length + 1}`,
      description: "A new workflow",
      agents: [],
      steps: [],
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await createWorkflow.mutateAsync(newWorkflow);
  };

  const handleCreateAgent = async () => {
    if (!user) return;
    
    const newAgent: Omit<Agent, '_id'> = {
      name: `New Agent ${agents.length + 1}`,
      description: "A new AI agent",
      role: "assistant",
      systemPrompt: "You are a helpful AI assistant.",
      temperature: 0.7,
      model: "gpt-4",
      userId: user.uid,
      workflows: selectedWorkflowId ? [workflows.find((w: Workflow) => w._id === selectedWorkflowId)!] : [],
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
    ? workflows.find((w: Workflow) => w._id === selectedWorkflowId)
    : null;

  const filteredAgents = selectedWorkflow
    ? agents.filter((agent: Agent) => 
        agent.workflows.some((w: Workflow) => w._id === selectedWorkflowId)
      )
    : agents;

  const selectedAgent = selectedAgentId 
    ? agents.find((a: Agent) => a._id === selectedAgentId) || null
    : null;

  const isMobile = useIsMobile();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to OrchestrateUI</h1>
          <p className="text-gray-600 dark:text-gray-400">Please login to continue</p>
        </div>
      </div>
    );
  }

  if (isLoadingWorkflows || isLoadingAgents || isFetchingWorkflows || isFetchingAgents) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4">Loading data...</p>
        </div>
      </div>
    );
  }

  if (workflowsError || agentsError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading data. Please try again.</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <MobileLayout
        workflows={workflows}
        agents={agents}
      />
    );
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
