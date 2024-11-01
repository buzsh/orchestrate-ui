import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Workflow } from '@/models/Workflow';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { id } = await context.params;
    
    const workflow = await Workflow.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date().toISOString() },
      { new: true }
    ).populate('agents');
    
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(workflow);
  } catch (err) {
    console.error('Failed to update workflow:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update workflow' },
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
    
    const workflow = await Workflow.findByIdAndDelete(id);
    
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Workflow deleted successfully' });
  } catch (err) {
    console.error('Failed to delete workflow:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete workflow' },
      { status: 500 }
    );
  }
}
