import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Agent } from '@/data/types';

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agent: Omit<Agent, '_id'>) => {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (agent: Agent) => {
      const response = await fetch(`/api/agents/${agent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update agent');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agentId: string) => {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete agent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
