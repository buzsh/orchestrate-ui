import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  role: {
    type: String,
    enum: ['user', 'assistant', 'system']
  },
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const agentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  role: String,
  systemPrompt: String,
  temperature: Number,
  model: String,
  workflows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' }],
  conversations: [conversationSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema); 
