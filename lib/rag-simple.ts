import 'server-only';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage for embeddings
interface Document {
  id: string;
  content: string;
  metadata: any;
  embedding: number[];
}

let documents: Document[] = [];

// Generate embeddings using OpenAI
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Add documents to in-memory storage
export async function addDocuments(
  docs: { content: string; metadata: any }[]
) {
  const newDocs: Document[] = [];
  
  for (const doc of docs) {
    const embedding = await generateEmbedding(doc.content);
    newDocs.push({
      id: `doc_${Date.now()}_${Math.random()}`,
      content: doc.content,
      metadata: doc.metadata,
      embedding,
    });
  }
  
  documents.push(...newDocs);
  return newDocs.map(d => d.id);
}

// Query documents for similar content
export async function queryDocuments(
  query: string,
  nResults: number = 5
): Promise<{
  documents: string[][];
  metadatas: any[][];
  distances: number[][];
}> {
  const queryEmbedding = await generateEmbedding(query);
  
  // Calculate similarity scores for all documents
  const scored = documents.map(doc => ({
    doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));
  
  // Sort by similarity (highest first) and take top N
  scored.sort((a, b) => b.similarity - a.similarity);
  const topResults = scored.slice(0, nResults);
  
  // Convert similarity to distance (1 - similarity)
  const results = topResults.map(r => r.doc);
  const distances = topResults.map(r => 1 - r.similarity);
  
  return {
    documents: [results.map(d => d.content)],
    metadatas: [results.map(d => d.metadata)],
    distances: [distances],
  };
}

// Generate response using RAG
export async function generateRAGResponse(
  query: string
): Promise<{
  response: string;
  relevantDocuments: string[];
  confidence: string;
}> {
  // Retrieve relevant documents
  const { documents: docs, distances } = await queryDocuments(query, 5);
  const relevantDocs = docs[0] || [];
  const relevanceScores = distances[0] || [];

  // Build context from retrieved documents
  const context = relevantDocs.join("\n\n");

  // Calculate confidence based on distance scores
  const avgDistance = relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length;
  let confidence = "High";
  if (avgDistance > 0.3) confidence = "Medium";
  if (avgDistance > 0.5) confidence = "Low";

  // Generate response using OpenAI with retrieved context
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a professional AI assistant representing Meera, an AI Agent Developer. 
Answer questions about her professional experience, skills, and achievements based on the provided context.
Be conversational, accurate, and highlight relevant accomplishments.
If the context doesn't contain information to answer the question, say so honestly.

Context from professional profile:
${context}`
      },
      {
        role: "user",
        content: query
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return {
    response: completion.choices[0].message.content || "Unable to generate response",
    relevantDocuments: relevantDocs,
    confidence,
  };
}

// Initialize vector database with profile data
export async function initializeVectorDB(
  docs: { content: string; metadata: any }[]
) {
  if (documents.length === 0) {
    await addDocuments(docs);
    return { success: true, message: `Added ${docs.length} documents to vector database` };
  }
  
  return { success: true, message: `Vector database already initialized with ${documents.length} documents` };
}

// Reset the in-memory storage
export async function resetVectorDB() {
  documents = [];
  return { success: true, message: "Vector database reset successfully" };
}
