import 'server-only';
import { Index } from '@upstash/vector';

const UPSTASH_VECTOR_REST_URL = process.env.UPSTASH_VECTOR_REST_URL;
const UPSTASH_VECTOR_REST_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN;

if (!UPSTASH_VECTOR_REST_URL || !UPSTASH_VECTOR_REST_TOKEN) {
  throw new Error('UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN are required. Get them from: https://console.upstash.com/');
}

// Initialize Upstash Vector index
const index = new Index({
  url: UPSTASH_VECTOR_REST_URL,
  token: UPSTASH_VECTOR_REST_TOKEN,
});

let isInitialized = false;

// Add documents with embeddings to Upstash Vector
export async function addDocuments(docs: { content: string; metadata: any }[]) {
  console.log(`Adding ${docs.length} documents to Upstash Vector...`);
  
  try {
    // Upstash Vector automatically generates embeddings
    // Prepare data in the format Upstash expects
    const vectors = docs.map((doc, i) => ({
      id: `doc_${Date.now()}_${i}`,
      data: doc.content,
      metadata: {
        ...doc.metadata,
        content: doc.content,
      },
    }));

    // Upsert vectors in batches of 100 (Upstash limit)
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`Processed ${Math.min(i + batchSize, vectors.length)}/${vectors.length} documents`);
    }
    
    console.log(`Successfully added ${docs.length} documents to Upstash Vector`);
    return vectors.map(v => v.id);
  } catch (error: any) {
    console.error('Error adding documents:', error);
    throw new Error(`Failed to add documents: ${error.message}`);
  }
}

// Query documents using semantic search
async function queryDocuments(query: string, topK: number = 3) {
  try {
    // Upstash Vector automatically converts query to embedding and searches
    const results = await index.query({
      data: query,
      topK,
      includeMetadata: true,
    });
    
    if (!results || results.length === 0) {
      return {
        documents: [],
        metadatas: [],
        similarities: [],
      };
    }
    
    return {
      documents: results.map(r => (r.metadata?.content as string) || ''),
      metadatas: results.map(r => r.metadata || {}),
      similarities: results.map(r => r.score || 0),
    };
  } catch (error: any) {
    console.error('Query error:', error);
    throw new Error(`Failed to query documents: ${error.message}`);
  }
}

// Get relevant context for RAG (used by streaming chat)
export async function getRelevantContext(query: string): Promise<{
  context: string;
  relevantDocs: string[];
  confidence: string;
}> {
  try {
    // Check if database has data (auto-initialize check)
    if (!isInitialized) {
      const info = await index.info();
      if (info.vectorCount > 0) {
        isInitialized = true;
        console.log(`✅ Auto-detected ${info.vectorCount} vectors in database`);
      } else {
        throw new Error('Vector database is empty. Please initialize it first by visiting /migrate-resume or /api/initialize');
      }
    }

    // Retrieve relevant documents
    const { documents: relevantDocs, similarities } = await queryDocuments(query, 3);
    
    if (relevantDocs.length === 0) {
      return {
        context: "No relevant information found in Meera's profile.",
        relevantDocs: [],
        confidence: "Low",
      };
    }

    // Calculate confidence based on similarity scores
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    let confidence = "High";
    if (avgSimilarity < 0.7) confidence = "Medium";
    if (avgSimilarity < 0.5) confidence = "Low";

    const context = relevantDocs.join("\n\n");

    return {
      context,
      relevantDocs,
      confidence,
    };
  } catch (error: any) {
    console.error('Context retrieval error:', error);
    throw new Error(`Failed to retrieve context: ${error.message}`);
  }
}

export async function initializeVectorDB(docs: { content: string; metadata: any }[]) {
  if (isInitialized) {
    return { 
      success: true, 
      message: `Vector database already initialized with Upstash Vector` 
    };
  }
  
  console.log('Initializing Upstash Vector database...');
  console.log(`Processing ${docs.length} documents...`);
  
  try {
    // Check if index already has data
    const info = await index.info();
    console.log(`Upstash Vector index info:`, info);
    
    // Add documents if needed
    if (info.vectorCount === 0 || info.vectorCount < docs.length) {
      await addDocuments(docs);
    } else {
      console.log(`Index already contains ${info.vectorCount} vectors, skipping upload`);
    }
    
    isInitialized = true;
    
    return { 
      success: true, 
      message: `Successfully initialized with ${docs.length} documents using Upstash Vector` 
    };
  } catch (error: any) {
    console.error('Initialization error:', error);
    
    return { 
      success: false, 
      message: `Failed to initialize: ${error.message}` 
    };
  }
}

export async function resetVectorDB() {
  try {
    await index.reset();
    isInitialized = false;
    return { success: true, message: "Vector database reset" };
  } catch (error: any) {
    return { success: false, message: `Failed to reset: ${error.message}` };
  }
}
