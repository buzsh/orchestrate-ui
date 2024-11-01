import { useQuery } from '@tanstack/react-query';
import type { Workflow } from '@/data/types';

async function fetchWorkflows(): Promise<Workflow[]> {
  const response = await fetch('/api/workflows');
  if (!response.ok) {
    throw new Error('Network response was not ok');
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
  });

  return {
    workflows,
    isLoading,
    isError,
    error,
    refetch
  };
} 
