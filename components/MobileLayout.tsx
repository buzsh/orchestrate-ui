"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoChevronBackOutline } from "react-icons/io5";
import Sidebar from './Sidebar';
import AgentList from './AgentList';
import DetailView from './DetailView';
import { Agent, Workflow } from '@/data/types';
import { useMutations } from '@/lib/hooks/useData';

interface MobileLayoutProps {
  workflows: Workflow[];
  agents: Agent[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ workflows, agents }) => {
  const router = useRouter();
  const params = useParams();
  
  const workflowId = params.workflow as string || null;
  const agentId = params.agent as string || null;

  const handleSelectWorkflow = (newWorkflowId: string | null) => {
    if (newWorkflowId) {
      router.push(`/${newWorkflowId}`);
    } else {
      router.push('/');
    }
  };

  const handleSelectAgent = (newAgentId: string) => {
    if (workflowId) {
      router.push(`/${workflowId}/${newAgentId}`);
    } else {
      router.push(`/all/${newAgentId}`);
    }
  };

  const handleBack = () => {
    if (agentId) {
      router.back();
    } else if (workflowId) {
      router.back();
    }
  };

  const {
    createWorkflow,
    updateWorkflow,
    createAgent,
    updateAgent
  } = useMutations();

  const handleCreateWorkflow = async () => {
    const newWorkflow: Omit<Workflow, '_id'> = {
      name: `New Workflow ${workflows.length + 1}`,
      description: "A new workflow",
      agents: [],
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      const created = await createWorkflow.mutateAsync(newWorkflow);
      router.push(`/${created._id}`);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleCreateAgent = async () => {
    const newAgent: Omit<Agent, '_id'> = {
      name: `New Agent ${agents.length + 1}`,
      description: "A new AI agent",
      role: "assistant",
      systemPrompt: "You are a helpful AI assistant.",
      temperature: 0.7,
      model: "gpt-4",
      workflows: workflowId ? [workflows.find((w: Workflow) => w._id === workflowId)!] : [],
      conversations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      const created = await createAgent.mutateAsync(newAgent);
      if (workflowId) {
        router.push(`/${workflowId}/${created._id}`);
      } else {
        router.push(`/all/${created._id}`);
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleSaveAgent = async (updatedAgent: Agent) => {
    try {
      await updateAgent.mutateAsync(updatedAgent);
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  const filteredAgents = workflowId !== null
    ? agents.filter(agent => 
        agent.workflows.some(w => w._id === workflowId)
      )
    : agents;

  const selectedAgent = agentId
    ? agents.find(a => a._id === agentId) || null
    : null;

  const selectedWorkflow = workflowId
    ? workflows.find(w => w._id === workflowId)
    : null;

  // Determine which view to show based on URL params
  const currentView = agentId ? 'detail' : (workflowId ? 'agents' : 'workflows');

  const handleWorkflowNameSave = async (name: string) => {
    if (!selectedWorkflow) return;
    
    const updatedWorkflow: Workflow = {
      ...selectedWorkflow,
      name,
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await updateWorkflow.mutateAsync(updatedWorkflow);
    } catch (error) {
      console.error('Failed to update workflow name:', error);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <header className="flex-none bg-gray-50 dark:bg-gray-900 p-4 flex items-center border-b border-gray-200 dark:border-gray-800 md:hidden">
        {currentView !== 'workflows' && (
          <button onClick={handleBack} className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <IoChevronBackOutline className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold">
          {currentView === 'workflows' && 'Dashboard'}
          {currentView === 'agents' && 'Workflows'}
          {currentView === 'detail' && 'Agents'}
        </h1>
      </header>

      <main className="flex-1">
        {currentView === 'workflows' && (
          <div className="h-full">
            <Sidebar
              workflows={workflows}
              selectedWorkflowId={workflowId}
              onSelectWorkflow={handleSelectWorkflow}
              onCreateWorkflow={handleCreateWorkflow}
            />
          </div>
        )}
        {currentView === 'agents' && (
          <div className="h-full">
            <AgentList
              agents={filteredAgents}
              selectedAgentId={agentId}
              onSelectAgent={handleSelectAgent}
              onCreateAgent={handleCreateAgent}
              selectedWorkflowName={selectedWorkflow?.name || null}
              onSaveWorkflow={handleWorkflowNameSave}
            />
          </div>
        )}
        {currentView === 'detail' && (
          <div className="h-full">
            <DetailView
              agent={selectedAgent}
              onSave={handleSaveAgent}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileLayout;
