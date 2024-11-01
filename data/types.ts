export interface Agent {
  id: number;
  name: string;
  description: string;
  role: string;
  systemPrompt: string;
  temperature: number;
  model: string;
  createdAt: string;
  updatedAt: string;
  workflows: Workflow[];
  conversations: Conversation[];
}

export interface Workflow {
  id: number;
  name: string;
  description: string;
  agents: Agent[];
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: number;
  agentId: number;
  order: number;
  instruction: string;
  waitForHuman: boolean;
}

export interface Conversation {
  id: number;
  messages: Message[];
  agentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
}
