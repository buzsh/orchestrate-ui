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
    await connectToDatabase();
    const workflows = await Workflow.find().populate('agents');
    return NextResponse.json(workflows);
  } catch (err) {
    console.error('Failed to fetch workflows:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch workflows' }, 
      { status: 500 }
    );
  }
}
