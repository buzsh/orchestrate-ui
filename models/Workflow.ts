import mongoose from 'mongoose';

const workflowStepSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  order: Number,
  instruction: String,
  waitForHuman: Boolean
});

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }],
  steps: [workflowStepSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema); 
