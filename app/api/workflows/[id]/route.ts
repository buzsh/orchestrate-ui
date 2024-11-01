import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Workflow } from '@/models/Workflow';

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = await context.params.id;
    await connectToDatabase();
    const data = await req.json();
    
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
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = await context.params.id;
    await connectToDatabase();
    
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
