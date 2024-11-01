import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Agent, Workflow } from '@/data/types';

// Queries
export function useWorkflowsQuery() {
  return useQuery<Workflow[]>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await fetch('/api/workflows');
      return response.json();
    }
  });
}

export function useAgentsQuery() {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents');
      return response.json();
    }
  });
}

// Mutations
export function useMutations() {
  const queryClient = useQueryClient();
  
  const createWorkflow = useMutation({
    mutationFn: async (workflow: Omit<Workflow, '_id'>) => {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] })
  });

  const updateWorkflow = useMutation({
    mutationFn: async (workflow: Workflow) => {
      const response = await fetch(`/api/workflows/${workflow._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] })
  });

  const deleteWorkflow = useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete workflow');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] })
  });

  const createAgent = useMutation({
    mutationFn: async (agent: Omit<Agent, '_id'>) => {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] })
  });

  const updateAgent = useMutation({
    mutationFn: async (agent: Agent) => {
      const response = await fetch(`/api/agents/${agent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] })
  });

  const deleteAgent = useMutation({
    mutationFn: async (agentId: string) => {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete agent');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] })
  });

  return {
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    createAgent,
    updateAgent,
    deleteAgent
  };
} 