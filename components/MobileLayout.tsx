"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoChevronBackOutline } from "react-icons/io5";
import Sidebar from './Sidebar';
import AgentList from './AgentList';
import DetailView from './DetailView';
import { Agent, Workflow } from '@/data/types';

interface MobileLayoutProps {
  workflows: Workflow[];
  agents: Agent[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ workflows, agents }) => {
  const router = useRouter();
  const params = useParams();
  
  const workflowId = params.workflow ? parseInt(params.workflow as string) : null;
  const agentId = params.agent ? parseInt(params.agent as string) : null;

  const handleSelectWorkflow = (newWorkflowId: number | null) => {
    if (newWorkflowId) {
      router.push(`/${newWorkflowId}`);
    } else {
      router.push('/');
    }
  };

  const handleSelectAgent = (newAgentId: number) => {
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

  const handleCreateWorkflow = () => {
    // Implement workflow creation logic
    console.log('Create workflow');
  };

  const handleCreateAgent = () => {
    // Implement agent creation logic
    console.log('Create agent');
  };

  const handleSaveAgent = (updatedAgent: Agent) => {
    // Implement agent save logic
    console.log('Save agent', updatedAgent);
  };

  const filteredAgents = workflowId !== null
    ? agents.filter(agent => agent.workflows.some(w => w.id === workflowId))
    : agents;

  const selectedAgent = agentId
    ? agents.find(a => a.id === agentId) || null
    : null;

  const selectedWorkflow = workflowId
    ? workflows.find(w => w.id === workflowId)
    : null;

  // Determine which view to show based on URL params
  const currentView = agentId ? 'detail' : (workflowId ? 'agents' : 'workflows');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <header className="flex-none bg-gray-100 dark:bg-gray-900 p-4 flex items-center border-b border-gray-200 dark:border-gray-800 md:hidden">
        {currentView !== 'workflows' && (
          <button onClick={handleBack} className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <IoChevronBackOutline className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold">
          {currentView === 'workflows' && 'Workflows'}
          {currentView === 'agents' && (selectedWorkflow?.name || 'All Agents')}
          {currentView === 'detail' && selectedAgent?.name}
        </h1>
      </header>

      <main className="flex-1 min-h-0">
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
