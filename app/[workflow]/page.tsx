"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import useIsMobile from "@/hooks/useIsMobile";
import { useCreateWorkflow } from '@/hooks/useWorkflowMutations';
import { Agent, Workflow } from "@/data/types";

export default function WorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const createWorkflow = useCreateWorkflow();

  const { data: workflows = [], isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await fetch('/api/workflows');
      return response.json();
    },
  });

  const { data: agents = [], isLoading: isLoadingAgents } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents');
      return response.json();
    },
  });

  const workflowId = params.workflow ? parseInt(params.workflow as string) : null;
  const selectedWorkflow = workflowId 
    ? workflows.find((w: Workflow) => w.id === workflowId)
    : null;
  
  const filteredAgents = workflowId
    ? agents.filter((agent: Agent) => 
        agent.workflows.some((w: Workflow) => w.id === workflowId)
      )
    : agents;

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
        onCreateWorkflow={async () => {
          const newWorkflow = {
            name: `New Workflow ${workflows.length + 1}`,
            description: "A new workflow",
            agents: [],
            steps: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await createWorkflow.mutateAsync(newWorkflow);
        }}
      />
      <AgentList
        agents={filteredAgents}
        selectedAgentId={null}
        onSelectAgent={(agentId) => router.push(`/${workflowId}/${agentId}`)}
        onCreateAgent={() => {/* implement */}}
        selectedWorkflowName={selectedWorkflow?.name || null}
      />
      <DetailView 
        agent={null}
        onSave={() => {}}
      />
    </div>
  );
}
