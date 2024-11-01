import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Agent } from '@/models/Agent';

export async function GET() {
  try {
    await connectToDatabase();
    const agents = await Agent.find().populate('workflows');
    return NextResponse.json(agents);
  } catch (err) {
    console.error('Failed to fetch agents:', err);
    if (err instanceof Error) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch agents' }, 
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
