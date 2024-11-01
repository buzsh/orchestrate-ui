import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Agent } from '@/models/Agent';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { id } = await context.params;
    
    const agent = await Agent.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date().toISOString() },
      { new: true }
    ).populate('workflows');
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(agent);
  } catch (err) {
    console.error('Failed to update agent:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    
    const agent = await Agent.findByIdAndDelete(id);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (err) {
    console.error('Failed to delete agent:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete agent' },
      { status: 500 }
    );
  }
}
