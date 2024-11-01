import { useQuery } from '@tanstack/react-query';
import type { Workflow } from '@/data/types';

async function fetchWorkflows(): Promise<Workflow[]> {
  const response = await fetch('/api/workflows');
  if (!response.ok) {
    throw new Error('Failed to fetch workflows');
  }
  return response.json();
}

export function useWorkflows() {
  const { 
    data: workflows, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows,
    staleTime: 1000, // Optional: prevents rapid refetches
  });

  return {
    workflows,
    isLoading,
    isError,
    error,
    refetch
  };
} 
