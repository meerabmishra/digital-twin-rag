import 'server-only';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/';

// Free models from Hugging Face
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const LLM_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

// In-memory storage
interface Document {
  id: string;
  content: string;
  metadata: any;
  embedding: number[];
}

let documents: Document[] = [];

// Generate embeddings using Hugging Face (FREE)
async function generateEmbedding(text: string): Promise<number[]> {
  if (!HF_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not set. Get a free key at https://huggingface.co/settings/tokens');
  }

  const response = await fetch(`${HF_API_URL}${EMBEDDING_MODEL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      options: { wait_for_model: true }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const embedding = await response.json();
  return Array.isArray(embedding) ? embedding : embedding.embeddings || [];
}

// Calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Add documents
export async function addDocuments(docs: { content: string; metadata: any }[]) {
  const newDocs: Document[] = [];
  
  for (const doc of docs) {
    try {
      const embedding = await generateEmbedding(doc.content);
      newDocs.push({
        id: `doc_${Date.now()}_${Math.random()}`,
        content: doc.content,
        metadata: doc.metadata,
        embedding,
      });
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error generating embedding:', error);
    }
  }
  
  documents.push(...newDocs);
  return newDocs.map(d => d.id);
}

// Query documents
async function queryDocuments(query: string, nResults: number = 5) {
  const queryEmbedding = await generateEmbedding(query);
  
  const scored = documents.map(doc => ({
    doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));
  
  scored.sort((a, b) => b.similarity - a.similarity);
  const topResults = scored.slice(0, nResults);
  
  const results = topResults.map(r => r.doc);
  const distances = topResults.map(r => 1 - r.similarity);
  
  return {
    documents: [results.map(d => d.content)],
    metadatas: [results.map(d => d.metadata)],
    distances: [distances],
  };
}

// Generate response using Hugging Face (FREE)
export async function generateRAGResponse(query: string): Promise<{
  response: string;
  relevantDocuments: string[];
  confidence: string;
}> {
  if (!HF_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not set. Get a free key at https://huggingface.co/settings/tokens');
  }

  // Retrieve relevant documents
  const { documents: docs, distances } = await queryDocuments(query, 3);
  const relevantDocs = docs[0] || [];
  const relevanceScores = distances[0] || [];

  const context = relevantDocs.join("\n\n");
  const avgDistance = relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length;
  let confidence = "High";
  if (avgDistance > 0.3) confidence = "Medium";
  if (avgDistance > 0.5) confidence = "Low";

  const prompt = `You are a professional AI assistant representing Meera, an AI Agent Developer.
Answer the question based on the context provided. Be conversational and accurate.

Context:
${context}

Question: ${query}

Answer:`;

  const response = await fetch(`${HF_API_URL}${LLM_MODEL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
      options: { wait_for_model: true }
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate response');
  }

  const result = await response.json();
  const generatedText = Array.isArray(result) ? result[0]?.generated_text : result.generated_text;

  return {
    response: generatedText || "I can help answer questions about Meera's professional experience.",
    relevantDocuments: relevantDocs,
    confidence,
  };
}

export async function initializeVectorDB(docs: { content: string; metadata: any }[]) {
  if (documents.length === 0) {
    console.log('Initializing with Hugging Face embeddings (FREE)...');
    await addDocuments(docs);
    return { success: true, message: `Added ${docs.length} documents using FREE Hugging Face API` };
  }
  
  return { success: true, message: `Vector database already initialized with ${documents.length} documents` };
}

export async function resetVectorDB() {
  documents = [];
  return { success: true, message: "Vector database reset" };
}
