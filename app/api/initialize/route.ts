import { NextRequest, NextResponse } from 'next/server';
import { initializeVectorDB } from '@/lib/rag-upstash';
import { profileDocuments } from '@/lib/profile-data';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting vector database initialization...');
    
    // Check if required API keys are set
    const aiGatewayKey = process.env.AI_GATEWAY_API_KEY;
    const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
    const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;
    
    if (!aiGatewayKey || aiGatewayKey === 'your_ai_gateway_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'Vercel AI Gateway API key is required',
        details: 'Please add AI_GATEWAY_API_KEY to your .env.local file. Get it from https://vercel.com/dashboard > AI Gateway > API Keys'
      }, { status: 400 });
    }

    if (!upstashUrl || !upstashToken) {
      return NextResponse.json({
        success: false,
        error: 'Upstash Vector credentials are required',
        details: 'Please add UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN to your .env.local file. Get them from https://console.upstash.com/'
      }, { status: 400 });
    }

    const result = await initializeVectorDB(profileDocuments);
    
    if (result.success) {
      console.log('✅ Vector database initialized successfully');
      console.log('✅ Using Upstash Vector for embeddings and vector storage');
      console.log('✅ Using Vercel AI Gateway for AI requests');
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Initialize error:', error);
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
