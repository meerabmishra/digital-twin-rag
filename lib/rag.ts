import 'server-only';
import { ChromaClient, Collection } from 'chromadb';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let chromaClient: ChromaClient | null = null;
let collection: Collection | null = null;

// Initialize ChromaDB client
export async function initChromaDB() {
  if (!chromaClient) {
    try {
      chromaClient = new ChromaClient({
        path: "http://localhost:8000"
      });
      // Test the connection
      await chromaClient.heartbeat();
    } catch (error) {
      chromaClient = null;
      throw new Error('Cannot connect to ChromaDB. Make sure it is running on port 8000. Run: docker run -p 8000:8000 chromadb/chroma');
    }
  }
  return chromaClient;
}

// Get or create collection
export async function getCollection() {
  if (collection) {
    return collection;
  }

  const client = await initChromaDB();
  
  try {
    // Try to get existing collection
    collection = await client.getOrCreateCollection({
      name: "professional_profile",
      metadata: { "description": "Professional digital twin profile data" }
    });
  } catch (error) {
    // Create new collection if it doesn't exist
    collection = await client.createCollection({
      name: "professional_profile",
      metadata: { "description": "Professional digital twin profile data" }
    });
  }

  return collection;
}

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

// Add documents to ChromaDB
export async function addDocuments(
  documents: { content: string; metadata: any }[]
) {
  const collection = await getCollection();

  const ids = documents.map(() => uuidv4());
  const embeddings = await Promise.all(
    documents.map(doc => generateEmbedding(doc.content))
  );
  const contents = documents.map(doc => doc.content);
  const metadatas = documents.map(doc => doc.metadata);

  await collection.add({
    ids,
    embeddings,
    documents: contents,
    metadatas,
  });

  return ids;
}

// Query ChromaDB for similar documents
export async function queryDocuments(
  query: string,
  nResults: number = 5
): Promise<{
  documents: string[][];
  metadatas: any[][];
  distances: number[][];
}> {
  const collection = await getCollection();
  const queryEmbedding = await generateEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults,
  });

  return {
    documents: (results.documents || []) as string[][],
    metadatas: (results.metadatas || []) as any[][],
    distances: (results.distances || []) as number[][],
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
  const { documents, distances } = await queryDocuments(query, 5);
  const relevantDocs = documents[0] || [];
  const relevanceScores = distances[0] || [];

  // Build context from retrieved documents
  const context = relevantDocs.join("\n\n");

  // Calculate confidence based on distance scores
  const avgDistance = relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length;
  let confidence = "High";
  if (avgDistance > 0.5) confidence = "Medium";
  if (avgDistance > 0.7) confidence = "Low";

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
  documents: { content: string; metadata: any }[]
) {
  const collection = await getCollection();
  
  // Check if collection already has documents
  const count = await collection.count();
  
  if (count === 0) {
    await addDocuments(documents);
    return { success: true, message: `Added ${documents.length} documents to vector database` };
  }
  
  return { success: true, message: `Vector database already initialized with ${count} documents` };
}

// Delete collection (for reset)
export async function resetVectorDB() {
  const client = await initChromaDB();
  try {
    await client.deleteCollection({ name: "professional_profile" });
    collection = null;
    return { success: true, message: "Vector database reset successfully" };
  } catch (error) {
    return { success: false, message: "Failed to reset vector database" };
  }
}
