import 'server-only';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models';

if (!HF_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY is required. Get one at: https://huggingface.co/settings/tokens');
}

// In-memory vector storage
interface Document {
  id: string;
  content: string;
  metadata: any;
  embedding: number[];
}

let documents: Document[] = [];

// Generate embedding using Hugging Face (Free)
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(`${HF_API_URL}/sentence-transformers/all-MiniLM-L6-v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${error}`);
    }

    const embedding = await response.json();
    return embedding;
  } catch (error: any) {
    console.error('Embedding error:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

// Calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }
  
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

// Add documents with embeddings
export async function addDocuments(docs: { content: string; metadata: any }[]) {
  const newDocs: Document[] = [];
  
  console.log(`Generating embeddings for ${docs.length} documents...`);
  
  // Generate embeddings one by one (Hugging Face free tier)
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    
    try {
      const embedding = await generateEmbedding(doc.content);
      
      newDocs.push({
        id: `doc_${Date.now()}_${i}`,
        content: doc.content,
        metadata: doc.metadata,
        embedding: embedding,
      });
      
      console.log(`Processed ${i + 1}/${docs.length} documents`);
      
      // Small delay to avoid rate limiting
      if (i < docs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error processing document ${i}:`, error);
      throw error;
    }
  }
  
  documents.push(...newDocs);
  console.log(`Successfully added ${newDocs.length} documents with embeddings`);
  return newDocs.map(d => d.id);
}

// Query documents using semantic search
async function queryDocuments(query: string, nResults: number = 3) {
  try {
    const queryEmbedding = await generateEmbedding(query);
    
    if (!queryEmbedding || queryEmbedding.length === 0) {
      throw new Error('Failed to generate query embedding');
    }
    
    const scored = documents.map(doc => ({
      doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding),
    }));
    
    scored.sort((a, b) => b.similarity - a.similarity);
    const topResults = scored.slice(0, nResults);
    
    return {
      documents: topResults.map(r => r.doc.content),
      metadatas: topResults.map(r => r.doc.metadata),
      similarities: topResults.map(r => r.similarity),
    };
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Get relevant context for RAG (used by streaming chat)
export async function getRelevantContext(query: string): Promise<{
  context: string;
  relevantDocs: string[];
  confidence: string;
}> {
  if (documents.length === 0) {
    throw new Error('Vector database not initialized. Please visit the chat page to initialize.');
  }

  try {
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
    if (avgSimilarity < 0.5) confidence = "Medium";
    if (avgSimilarity < 0.3) confidence = "Low";

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
  if (documents.length === 0) {
    console.log('Initializing vector database with Vercel AI SDK...');
    console.log(`Processing ${docs.length} documents...`);
    
    try {
      await addDocuments(docs);
      return { 
        success: true, 
        message: `Successfully initialized with ${documents.length} documents using Vercel AI SDK` 
      };
    } catch (error: any) {
      console.error('Initialization error:', error);
      
      return { 
        success: false, 
        message: `Failed to initialize: ${error.message}` 
      };
    }
  }
  
  return { 
    success: true, 
    message: `Vector database already initialized with ${documents.length} documents` 
  };
}

export async function resetVectorDB() {
  documents = [];
  return { success: true, message: "Vector database reset" };
}
