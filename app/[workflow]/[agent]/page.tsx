"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import useIsMobile from "@/hooks/useIsMobile";
import { Agent, Workflow } from "@/data/types";
import { useUpdateWorkflow } from '@/hooks/useWorkflowMutations';

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

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

  const workflowId = params.workflow as string || null;
  const agentId = params.agent as string || null;
  
  const selectedWorkflow = workflowId
    ? workflows.find(w => w._id === workflowId)
    : null;
  
  const filteredAgents = workflowId
    ? agents.filter(agent => agent.workflows.some(w => w._id === workflowId))
    : agents;
    
  const selectedAgent = agentId
    ? agents.find(a => a._id === agentId) || null
    : null;

  const updateWorkflow = useUpdateWorkflow();

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

  if (isMobile) {
    return <MobileLayout workflows={workflows} agents={agents} />;
  }

  if (isLoadingWorkflows || isLoadingAgents) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full">
      <Sidebar
        workflows={workflows}
        selectedWorkflowId={workflowId}
        onSelectWorkflow={(newWorkflowId) => {
          if (newWorkflowId) {
            router.push(`/${newWorkflowId}`);
          } else {
            router.push('/');
          }
        }}
        onCreateWorkflow={() => {
          // Implement workflow creation
          console.log('Create workflow');
        }}
      />
      <AgentList
        agents={filteredAgents}
        selectedAgentId={agentId}
        onSelectAgent={(newAgentId) => router.push(`/${workflowId}/${newAgentId}`)}
        onCreateAgent={() => {
          // Implement agent creation
          console.log('Create agent');
        }}
        selectedWorkflowName={selectedWorkflow?.name || null}
        onSaveWorkflow={handleWorkflowNameSave}
      />
      <DetailView 
        agent={selectedAgent}
        onSave={(updatedAgent) => {
          // Implement agent update
          console.log('Save agent', updatedAgent);
        }}
      />
    </div>
  );
}
