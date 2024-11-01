import { Agent, Workflow } from './types';

export const sampleWorkflows: Workflow[] = [
  {
    id: 1,
    name: "Content Creation",
    description: "A workflow for creating and reviewing content",
    agents: [],
    steps: [
      {
        id: 1,
        agentId: 1,
        order: 1,
        instruction: "Generate initial content",
        waitForHuman: false
      },
      {
        id: 2,
        agentId: 2,
        order: 2,
        instruction: "Review and edit content",
        waitForHuman: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Code Review",
    description: "Automated code review workflow",
    agents: [],
    steps: [
      {
        id: 3,
        agentId: 3,
        order: 1,
        instruction: "Review code for bugs",
        waitForHuman: false
      },
      {
        id: 4,
        agentId: 4,
        order: 2,
        instruction: "Suggest improvements",
        waitForHuman: false
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const sampleAgents: Agent[] = [
  {
    id: 1,
    name: "Content Writer",
    description: "Specialized in creating engaging content",
    role: "writer",
    systemPrompt: "You are a creative content writer focused on creating engaging and informative content.",
    temperature: 0.7,
    model: "gpt-4",
    workflows: [],
    conversations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Editor",
    description: "Reviews and improves content",
    role: "editor",
    systemPrompt: "You are an expert editor. Review content for clarity, accuracy, and style.",
    temperature: 0.3,
    model: "gpt-4",
    workflows: [],
    conversations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Code Reviewer",
    description: "Reviews code for bugs and issues",
    role: "code-reviewer",
    systemPrompt: "You are a code review expert. Analyze code for potential bugs and security issues.",
    temperature: 0.2,
    model: "claude-3-opus",
    workflows: [],
    conversations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Code Optimizer",
    description: "Suggests code improvements",
    role: "optimizer",
    systemPrompt: "You are a code optimization expert. Suggest improvements for better performance and readability.",
    temperature: 0.4,
    model: "claude-3-opus",
    workflows: [],
    conversations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Associate agents with workflows
sampleWorkflows[0].agents = [sampleAgents[0], sampleAgents[1]];
sampleWorkflows[1].agents = [sampleAgents[2], sampleAgents[3]];

// Associate workflows with agents
sampleAgents[0].workflows = [sampleWorkflows[0]];
sampleAgents[1].workflows = [sampleWorkflows[0]];
sampleAgents[2].workflows = [sampleWorkflows[1]];
sampleAgents[3].workflows = [sampleWorkflows[1]]; 
