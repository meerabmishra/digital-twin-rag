import { NextRequest, NextResponse } from 'next/server';
import { initializeVectorDB } from '@/lib/rag-demo';
import { profileDocuments } from '@/lib/profile-data';

export async function POST(request: NextRequest) {
  try {
    const result = await initializeVectorDB(profileDocuments);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Initialize error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize vector database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
