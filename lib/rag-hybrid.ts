import 'server-only';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/';
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

// In-memory storage
interface Document {
  id: string;
  content: string;
  metadata: any;
  embedding: number[];
}

let documents: Document[] = [];

// Generate embeddings using Hugging Face
async function generateEmbedding(text: string): Promise<number[]> {
  if (!HF_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not set');
  }

  try {
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
      throw new Error(`HF API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    
    // Handle different response formats
    if (Array.isArray(result)) {
      return result;
    } else if (result.embeddings && Array.isArray(result.embeddings)) {
      return result.embeddings;
    } else if (result[0] && Array.isArray(result[0])) {
      return result[0];
    }
    
    throw new Error('Invalid embedding format received');
  } catch (error: any) {
    console.error('Embedding error:', error);
    throw error;
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
  
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    try {
      console.log(`Processing document ${i + 1}/${docs.length}...`);
      const embedding = await generateEmbedding(doc.content);
      
      if (embedding && embedding.length > 0) {
        newDocs.push({
          id: `doc_${Date.now()}_${Math.random()}`,
          content: doc.content,
          metadata: doc.metadata,
          embedding,
        });
      }
      
      // Delay to avoid rate limits (500ms between requests)
      if (i < docs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error processing document ${i + 1}:`, error);
      // Continue with next document
    }
  }
  
  documents.push(...newDocs);
  console.log(`Successfully added ${newDocs.length} documents`);
  return newDocs.map(d => d.id);
}

// Query documents
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

// Generate response (local processing with template-based responses)
export async function generateRAGResponse(query: string): Promise<{
  response: string;
  relevantDocuments: string[];
  confidence: string;
}> {
  if (!HF_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not set');
  }

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

    // Generate response using retrieved context
    const context = relevantDocs.join("\n\n");
    const response = generateContextualResponse(query, context);

    return {
      response,
      relevantDocuments: relevantDocs,
      confidence,
    };
  } catch (error: any) {
    console.error('RAG response error:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

// Generate contextual response (template-based)
function generateContextualResponse(query: string, context: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Extract key information from context
  const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Skills query
  if (lowerQuery.includes('skill') || lowerQuery.includes('technology') || lowerQuery.includes('tech stack')) {
    const skills = context.match(/(?:Python|JavaScript|TypeScript|React|Node\.js|FastAPI|LangChain|RAG|Vector Databases|ChromaDB|Pinecone|Azure|AWS|Docker|Git)/gi) || [];
    const uniqueSkills = [...new Set(skills)];
    
    if (uniqueSkills.length > 0) {
      return `Meera has expertise in ${uniqueSkills.slice(0, 8).join(', ')}. She has demonstrated these skills across multiple projects including AI agent development, RAG systems, and full-stack applications.`;
    }
  }
  
  // Experience query
  if (lowerQuery.includes('experience') || lowerQuery.includes('work') || lowerQuery.includes('project')) {
    const relevantSentences = sentences.filter(s => 
      s.toLowerCase().includes('developed') || 
      s.toLowerCase().includes('built') ||
      s.toLowerCase().includes('implemented')
    ).slice(0, 3);
    
    if (relevantSentences.length > 0) {
      return `Based on Meera's experience: ${relevantSentences.join('. ')}.`;
    }
  }
  
  // Education query
  if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('university')) {
    if (context.toLowerCase().includes('bachelor')) {
      return "Meera holds a Bachelor's degree and has completed additional certifications in AI and software development, including specialized training in AI agent development and prompt engineering.";
    }
  }
  
  // Certification query
  if (lowerQuery.includes('certification') || lowerQuery.includes('certified')) {
    return "Meera has earned certifications in AI Agent Development, Prompt Engineering, and Full-Stack Development, demonstrating commitment to continuous learning and staying current with technology trends.";
  }
  
  // STAR format query
  if (lowerQuery.includes('star') || lowerQuery.includes('situation') || lowerQuery.includes('action') || lowerQuery.includes('result')) {
    const actionSentences = sentences.filter(s => 
      s.toLowerCase().includes('action:') || 
      s.toLowerCase().includes('result:')
    ).slice(0, 2);
    
    if (actionSentences.length > 0) {
      return actionSentences.join('. ');
    }
  }
  
  // Default: Return most relevant sentences
  const mostRelevant = sentences.slice(0, 3).join('. ');
  return mostRelevant || "Based on Meera's profile, she is an experienced AI Agent Developer with strong skills in building RAG systems, chatbots, and full-stack applications.";
}

export async function initializeVectorDB(docs: { content: string; metadata: any }[]) {
  if (documents.length === 0) {
    console.log('Initializing vector database with Hugging Face embeddings...');
    console.log(`Processing ${docs.length} documents...`);
    
    try {
      await addDocuments(docs);
      return { 
        success: true, 
        message: `Successfully initialized with ${documents.length} documents using Hugging Face embeddings` 
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
