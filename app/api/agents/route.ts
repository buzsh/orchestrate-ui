import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Agent } from '@/models/Agent';

export async function GET() {
  try {
    await dbConnect();
    const agents = await Agent.find({}).populate('workflows');
    return NextResponse.json(agents);
  } catch (error: unknown) {
    console.error('Failed to fetch agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
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
