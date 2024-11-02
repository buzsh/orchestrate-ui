import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Agent } from '@/models/Agent';
import { auth } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    await connectToDatabase();
    const agents = await Agent.find({ userId }).populate('workflows');
    
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
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const data = await request.json();
    const agent = await Agent.create({ ...data, userId });
    return NextResponse.json(agent);
  } catch (error: unknown) {
    console.error('Failed to create agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' }, 
      { status: 500 }
    );
  }
}
