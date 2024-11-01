import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Agent } from '@/models/Agent';

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const db = await connectToDatabase();
    console.log('MongoDB connection successful:', !!db);
    
    console.log('Fetching agents...');
    const agents = await Agent.find().populate('workflows');
    console.log('Agents fetched:', agents.length);
    
    return NextResponse.json(agents);
  } catch (err) {
    console.error('Failed to fetch agents:', {
      error: err instanceof Error ? {
        message: err.message,
        stack: err.stack,
        name: err.name
      } : err
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch agents',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const agent = await Agent.create(data);
    return NextResponse.json(agent);
  } catch (error: unknown) {
    console.error('Failed to create agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' }, 
      { status: 500 }
    );
  }
}
