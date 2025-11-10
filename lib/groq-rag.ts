import 'server-only';
import { Index } from '@upstash/vector';
import { generateText } from 'ai';

const UPSTASH_VECTOR_REST_URL = process.env.UPSTASH_VECTOR_REST_URL;
const UPSTASH_VECTOR_REST_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN;
const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY;

if (!UPSTASH_VECTOR_REST_URL || !UPSTASH_VECTOR_REST_TOKEN) {
  throw new Error('UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN are required. Get them from: https://console.upstash.com/');
}

if (!AI_GATEWAY_API_KEY) {
  throw new Error('AI_GATEWAY_API_KEY is required');
}

// Initialize Upstash Vector index
const index = new Index({
  url: UPSTASH_VECTOR_REST_URL,
  token: UPSTASH_VECTOR_REST_TOKEN,
});

let isInitialized = false;

// Enhanced query preprocessing - simple keyword expansion
export async function enhanceQuery(originalQuery: string): Promise<string> {
  // Simple enhancement without external API calls
  const enhanced = `${originalQuery} professional experience skills achievements projects certifications education`;
  console.log(`🔍 Query enhanced: "${originalQuery}" → "${enhanced}"`);
  return enhanced;
}

// Query vector database
async function queryVectorDatabase(query: string, topK: number = 5) {
  try {
    const results = await index.query({
      data: query,
      topK,
      includeMetadata: true,
    });
    
    if (!results || results.length === 0) {
      return [];
    }
    
    return results.map(r => ({
      content: (r.metadata?.content as string) || '',
      metadata: r.metadata || {},
      score: r.score || 0,
    }));
  } catch (error: any) {
    console.error('Vector query error:', error);
    throw new Error(`Failed to query vectors: ${error.message}`);
  }
}

// Format response for interview context - simple formatting
export async function formatForInterview(
  results: any[],
  originalQuestion: string
): Promise<string> {
  const context = results
    .map(r => r.content)
    .filter(c => c)
    .join('\n\n');

  if (!context) {
    return "I don't have specific information about that in my profile.";
  }

  // Return formatted context without AI processing
  return `Based on my professional profile:\n\n${context}`;
}

// Main enhanced RAG query function
export async function enhancedRAGQuery(question: string) {
  try {
    // Check if database is initialized
    if (!isInitialized) {
      const info = await index.info();
      if (info.vectorCount > 0) {
        isInitialized = true;
        console.log(`✅ Auto-detected ${info.vectorCount} vectors in database`);
      } else {
        throw new Error('Vector database is empty. Please initialize it first.');
      }
    }

    // Step 1: Enhance the query with LLM
    const enhancedQuery = await enhanceQuery(question);
    
    // Step 2: Search vector database with enhanced query
    console.log('🔍 Searching vector database...');
    const vectorResults = await queryVectorDatabase(enhancedQuery, 5);
    
    if (vectorResults.length === 0) {
      return {
        response: "I don't have relevant information about that in my profile.",
        confidence: 'Low',
        sources: []
      };
    }

    console.log(`📚 Found ${vectorResults.length} relevant documents`);
    
    // Step 3: Format response for interview with LLM
    console.log('⚡ Generating interview-ready response...');
    const interviewResponse = await formatForInterview(vectorResults, question);
    
    // Calculate confidence
    const avgScore = vectorResults.reduce((sum, r) => sum + r.score, 0) / vectorResults.length;
    let confidence = 'High';
    if (avgScore < 0.7) confidence = 'Medium';
    if (avgScore < 0.5) confidence = 'Low';
    
    return {
      response: interviewResponse,
      confidence,
      sources: vectorResults.map(r => ({
        content: r.content.substring(0, 200) + '...',
        score: r.score
      }))
    };
  } catch (error: any) {
    console.error('Enhanced RAG query failed:', error);
    throw new Error(`Failed to process query: ${error.message}`);
  }
}

// Basic RAG query without LLM enhancement (fallback)
export async function basicRAGQuery(question: string) {
  try {
    if (!isInitialized) {
      const info = await index.info();
      if (info.vectorCount > 0) {
        isInitialized = true;
        console.log(`✅ Auto-detected ${info.vectorCount} vectors in database`);
      } else {
        throw new Error('Vector database is empty.');
      }
    }

    const results = await queryVectorDatabase(question, 3);
    
    if (results.length === 0) {
      return {
        context: "No relevant information found.",
        relevantDocs: [],
        confidence: "Low"
      };
    }

    const context = results.map(r => r.content).join('\n\n');
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    
    let confidence = 'High';
    if (avgScore < 0.7) confidence = 'Medium';
    if (avgScore < 0.5) confidence = 'Low';

    return {
      context,
      relevantDocs: results.map(r => r.content),
      confidence
    };
  } catch (error: any) {
    console.error('Basic RAG query failed:', error);
    throw error;
  }
}

// Add documents function (for initialization)
export async function addDocuments(docs: { content: string; metadata: any }[]) {
  console.log(`Adding ${docs.length} documents to Upstash Vector...`);
  
  try {
    const vectors = docs.map((doc, i) => ({
      id: `doc_${Date.now()}_${i}`,
      data: doc.content,
      metadata: {
        ...doc.metadata,
        content: doc.content,
      },
    }));

    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`Processed ${Math.min(i + batchSize, vectors.length)}/${vectors.length} documents`);
    }
    
    console.log(`Successfully added ${docs.length} documents`);
    isInitialized = true;
    return vectors.map(v => v.id);
  } catch (error: any) {
    console.error('Error adding documents:', error);
    throw new Error(`Failed to add documents: ${error.message}`);
  }
}

// Initialize vector database
export async function initializeVectorDB(docs: { content: string; metadata: any }[]) {
  console.log('Initializing Upstash Vector database...');
  
  try {
    const info = await index.info();
    console.log(`Current vectors in database: ${info.vectorCount}`);
    
    if (info.vectorCount === 0 || info.vectorCount < docs.length) {
      await addDocuments(docs);
    } else {
      console.log(`Database already contains ${info.vectorCount} vectors`);
    }
    
    isInitialized = true;
    
    return { 
      success: true, 
      message: `Successfully initialized with ${docs.length} documents` 
    };
  } catch (error: any) {
    console.error('Initialization error:', error);
    return { 
      success: false, 
      message: `Failed to initialize: ${error.message}` 
    };
  }
}

// Reset vector database
export async function resetVectorDB() {
  try {
    await index.reset();
    isInitialized = false;
    return { success: true, message: "Vector database reset" };
  } catch (error: any) {
    return { success: false, message: `Failed to reset: ${error.message}` };
  }
}
