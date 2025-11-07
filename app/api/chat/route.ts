import { NextRequest, NextResponse } from 'next/server';
import { generateRAGResponse } from '@/lib/rag-vercel';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await generateRAGResponse(query);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process query',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
