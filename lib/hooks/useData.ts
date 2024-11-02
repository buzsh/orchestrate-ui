import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Agent, Workflow } from '@/data/types';
import { useAuth } from '@/contexts/AuthContext';

// Queries
export function useWorkflowsQuery() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['workflows', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const token = await user.getIdToken();
      const response = await fetch('/api/workflows', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      
      return response.json();
    },
    enabled: !!user, // Only fetch when user is logged in
  });
}

export function useAgentsQuery() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['agents', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const token = await user.getIdToken();
      const response = await fetch('/api/agents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      
      return response.json();
    },
    enabled: !!user, // Only fetch when user is logged in
  });
}

// Mutations
export function useMutations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const getHeaders = async () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${await user?.getIdToken()}`,
  });

  const createWorkflow = useMutation({
    mutationFn: async (newWorkflow: Omit<Workflow, '_id'>) => {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(newWorkflow),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const updateWorkflow = useMutation({
    mutationFn: async (workflow: Workflow) => {
      const response = await fetch(`/api/workflows/${workflow._id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(workflow)
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] })
  });

  const deleteWorkflow = useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
        headers: await getHeaders(),
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
        headers: await getHeaders(),
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
        headers: await getHeaders(),
        body: JSON.stringify(agent)
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] })
  });

  const deleteAgent = useMutation({
    mutationFn: async (agentId: string) => {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
        headers: await getHeaders(),
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
