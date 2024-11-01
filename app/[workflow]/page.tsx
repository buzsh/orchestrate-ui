"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import { sampleWorkflows, sampleAgents } from "@/data/sampleAgentData";
import useIsMobile from "@/hooks/useIsMobile";

export default function WorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const workflowId = params.workflow ? parseInt(params.workflow as string) : null;
  const selectedWorkflow = workflowId 
    ? sampleWorkflows.find(w => w.id === workflowId)
    : null;
  
  const filteredAgents = workflowId
    ? sampleAgents.filter(agent => agent.workflows.some(w => w.id === workflowId))
    : sampleAgents;

  if (isMobile) {
    return <MobileLayout workflows={sampleWorkflows} agents={sampleAgents} />;
  }

  return (
    <div className="flex h-full">
      <Sidebar
        workflows={sampleWorkflows}
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
        selectedAgentId={null}
        onSelectAgent={(agentId) => router.push(`/${workflowId}/${agentId}`)}
        onCreateAgent={() => {
          // Implement agent creation
          console.log('Create agent');
        }}
        selectedWorkflowName={selectedWorkflow?.name || null}
      />
      <DetailView 
        agent={null}
        onSave={() => {}} // Not needed in this view
      />
    </div>
  );
} 
