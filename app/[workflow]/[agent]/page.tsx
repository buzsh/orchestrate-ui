"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import useIsMobile from "@/hooks/useIsMobile";
import { useWorkflowsQuery, useAgentsQuery, useMutations } from '@/lib/hooks/useData';
import { Agent, Workflow } from "@/data/types";

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const { data: workflows = [], isLoading: isLoadingWorkflows } = useWorkflowsQuery();
  const { data: agents = [], isLoading: isLoadingAgents } = useAgentsQuery();
  const { updateWorkflow, updateAgent } = useMutations();

  const workflowId = params.workflow as string || null;
  const agentId = params.agent as string || null;
  
  const selectedWorkflow = workflowId
    ? workflows.find(w => w._id === workflowId)
    : null;
  
  const filteredAgents = workflowId
    ? agents
    : agents;
    
  const selectedAgent = agentId
    ? agents.find(a => a._id === agentId) || null
    : null;

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

  const handleSaveAgent = async (updatedAgent: Agent) => {
    try {
      await updateAgent.mutateAsync(updatedAgent);
    } catch (error) {
      console.error('Failed to update agent:', error);
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
        onSave={handleSaveAgent}
      />
    </div>
  );
}
