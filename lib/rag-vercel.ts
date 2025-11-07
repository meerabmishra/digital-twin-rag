import 'server-only';
import { openai } from '@ai-sdk/openai';
import { embed, embedMany, generateText } from 'ai';

// OpenAI API key is required
// Vercel AI Gateway helps with rate limiting and monitoring, but you still need an API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set. Please add it to your environment variables.');
}

// In-memory vector storage
interface Document {
  id: string;
  content: string;
  metadata: any;
  embedding: number[];
}

let documents: Document[] = [];

// Generate embedding using Vercel AI SDK
async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required. Please add OPENAI_API_KEY to your Vercel environment variables.');
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: text,
    });
    
    return embedding;
  } catch (error: any) {
    console.error('Embedding error:', error);
    
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error('OpenAI API quota exceeded. Please check your billing at https://platform.openai.com/account/billing');
    }
    
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
  
  // Generate embeddings in batches for better performance
  const batchSize = 10;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, Math.min(i + batchSize, docs.length));
    
    try {
      // Use embedMany for batch processing
      const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: batch.map(doc => doc.content),
      });
      
      for (let j = 0; j < batch.length; j++) {
        newDocs.push({
          id: `doc_${Date.now()}_${i + j}`,
          content: batch[j].content,
          metadata: batch[j].metadata,
          embedding: embeddings[j],
        });
      }
      
      console.log(`Processed ${Math.min(i + batchSize, docs.length)}/${docs.length} documents`);
    } catch (error) {
      console.error(`Error processing batch ${i}-${i + batchSize}:`, error);
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

// Generate RAG response using Vercel AI SDK
// Automatically uses AI Gateway when deployed on Vercel ($5/day free credits)
export async function generateRAGResponse(query: string): Promise<{
  response: string;
  relevantDocuments: string[];
  confidence: string;
}> {
  if (documents.length === 0) {
    throw new Error('Vector database not initialized. Please click "Start Chat" first.');
  }

  try {
    // Retrieve relevant documents
    const { documents: relevantDocs, similarities } = await queryDocuments(query, 3);
    
    if (relevantDocs.length === 0) {
      return {
        response: "I don't have enough information to answer that question based on Meera's profile.",
        relevantDocuments: [],
        confidence: "Low",
      };
    }

    // Calculate confidence based on similarity scores
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    let confidence = "High";
    if (avgSimilarity < 0.5) confidence = "Medium";
    if (avgSimilarity < 0.3) confidence = "Low";

    // Generate response using Vercel AI SDK
    // Uses AI Gateway automatically when on Vercel
    const context = relevantDocs.join("\n\n");
    
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: `You are a professional AI assistant representing Meera Mishra, a Frontend-Focused Full-Stack Developer.
Answer the question based on the context provided. Be conversational, accurate, and professional.

Context from Meera's profile:
${context}

Question: ${query}

Answer:`,
      temperature: 0.7,
      maxTokens: 300,
    });

    return {
      response: text,
      relevantDocuments: relevantDocs,
      confidence,
    };
  } catch (error: any) {
    console.error('RAG response error:', error);
    
    // Handle specific errors
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error('Daily AI Gateway quota reached ($5/day). Try again tomorrow or add your own OpenAI API key.');
    } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('API authentication failed. When deployed on Vercel, AI Gateway handles this automatically.');
    }
    
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

export async function initializeVectorDB(docs: { content: string; metadata: any }[]) {
  if (documents.length === 0) {
    console.log('Initializing vector database with Vercel AI SDK...');
    console.log(`Processing ${docs.length} documents...`);
    
    if (!OPENAI_API_KEY) {
      return { 
        success: false, 
        message: 'OpenAI API key is required. Please add OPENAI_API_KEY to your Vercel environment variables at: Project Settings > Environment Variables' 
      };
    }
    
    try {
      await addDocuments(docs);
      return { 
        success: true, 
        message: `Successfully initialized with ${documents.length} documents using Vercel AI SDK` 
      };
    } catch (error: any) {
      console.error('Initialization error:', error);
      
      // Provide helpful error messages
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        return { 
          success: false, 
          message: 'OpenAI API quota exceeded. Please add credits at https://platform.openai.com/account/billing' 
        };
      } else if (error.message?.includes('API key')) {
        return { 
          success: false, 
          message: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable in Vercel.' 
        };
      }
      
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
