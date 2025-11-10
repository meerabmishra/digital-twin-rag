import { enhancedRAGQuery } from '@/lib/groq-rag';

export const maxDuration = 30;

const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY;

if (!AI_GATEWAY_API_KEY) {
  throw new Error('AI_GATEWAY_API_KEY is required');
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log(`💬 User query: ${userQuery}`);

    // Get enhanced RAG response
    const { response, confidence, sources } = await enhancedRAGQuery(userQuery);

    console.log(`✅ Generated response with ${confidence} confidence`);

    // Create system message with enhanced context
    const systemMessage = `You are a professional AI assistant representing Meera Mishra, a Frontend-Focused Full-Stack Developer.

The following information has been retrieved from Meera's professional profile:

${response}

Respond naturally as if you are Meera, speaking in first person. Be professional, confident, and conversational. If asked follow-up questions, maintain consistency with the information provided.`;

    // Call Vercel AI Gateway directly
    const gatewayResponse = await fetch('https://gateway.ai.cloudflare.com/v1/90b5effcaa818ce03d9c10f796164ff6/digital-twin-gateway/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_GATEWAY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!gatewayResponse.ok) {
      throw new Error(`AI Gateway error: ${gatewayResponse.status}`);
    }

    console.log('✅ Streaming response from AI Gateway');

    // Return the streaming response
    return new Response(gatewayResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('❌ RAG query error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process query',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
