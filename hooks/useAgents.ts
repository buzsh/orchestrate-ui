import { useQuery } from '@tanstack/react-query';
import type { Agent } from '@/data/types';

async function fetchAgents(): Promise<Agent[]> {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useAgents() {
  const { 
    data: agents, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  return {
    agents,
    isLoading,
    isError,
    error,
    refetch
  };
} 
