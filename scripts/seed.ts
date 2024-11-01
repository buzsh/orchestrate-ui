import mongoose from 'mongoose';
import { config } from 'dotenv';
import { sampleWorkflows, sampleAgents } from '@/data/sampleAgentData';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Type assertion for db
    const db = mongoose.connection.db!;
    
    // Clear existing data
    await db.dropDatabase();
    console.log('Dropped existing database');

    // Create agents first
    const Agent = mongoose.model('Agent');
    const createdAgents = await Agent.create(sampleAgents);
    console.log('Created agents');

    // Create workflows and associate agents
    const Workflow = mongoose.model('Workflow');
    const workflowsWithAgents = sampleWorkflows.map(workflow => ({
      ...workflow,
      agents: workflow.agents.map(agent => 
        createdAgents.find(a => a.id === agent.id)?._id
      ).filter(Boolean) // Filter out undefined values
    }));

    const createdWorkflows = await Workflow.create(workflowsWithAgents);
    console.log('Created workflows');

    // Update agents with workflow references
    for (const agent of createdAgents) {
      const agentWorkflows = createdWorkflows.filter(w => 
        w.agents.some((id: mongoose.Types.ObjectId) => id?.toString() === agent._id?.toString())
      );
      
      if (agent._id) {
        await Agent.findByIdAndUpdate(agent._id, {
          workflows: agentWorkflows.map(w => w._id)
        });
      }
    }
    console.log('Updated agent-workflow associations');

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
