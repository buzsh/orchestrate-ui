"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AgentList from "@/components/AgentList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import { sampleWorkflows, sampleAgents } from "@/data/sampleAgentData";
import useIsMobile from "@/hooks/useIsMobile";

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const workflowId = params.workflow ? parseInt(params.workflow as string) : null;
  const agentId = params.agent ? parseInt(params.agent as string) : null;
  
  const selectedWorkflow = workflowId
    ? sampleWorkflows.find(w => w.id === workflowId)
    : null;
  
  const filteredAgents = workflowId
    ? sampleAgents.filter(agent => agent.workflows.some(w => w.id === workflowId))
    : sampleAgents;
    
  const selectedAgent = agentId
    ? sampleAgents.find(a => a.id === agentId) || null
    : null;

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
        selectedAgentId={agentId}
        onSelectAgent={(newAgentId) => router.push(`/${workflowId}/${newAgentId}`)}
        onCreateAgent={() => {
          // Implement agent creation
          console.log('Create agent');
        }}
        selectedWorkflowName={selectedWorkflow?.name || null}
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
