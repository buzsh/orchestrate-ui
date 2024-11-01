import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Workflow } from '@/models/Workflow';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const workflow = await Workflow.create(data);
    return NextResponse.json(workflow);
  } catch (err) {
    console.error('Failed to create workflow:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create workflow' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const db = await connectToDatabase();
    console.log('MongoDB connection successful:', !!db);
    
    console.log('Fetching workflows...');
    const workflows = await Workflow.find().populate('agents');
    console.log('Workflows fetched:', workflows.length);
    
    return NextResponse.json(workflows);
  } catch (err) {
    console.error('Failed to fetch workflows:', {
      error: err instanceof Error ? {
        message: err.message,
        stack: err.stack,
        name: err.name
      } : err
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch workflows',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
