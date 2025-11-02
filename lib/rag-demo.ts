import 'server-only';

// Mock data for demo mode
const mockResponses: Record<string, string> = {
  'skills': "Meera's main technical skills include Next.js 15, React 19, TypeScript, AI/ML Integration (OpenAI, RAG Systems), MCP (Model Context Protocol) Servers, Vector Databases (ChromaDB), Database Management (Prisma ORM, PostgreSQL), Authentication (Auth.js, OAuth), and Cloud Deployment (Vercel, AWS).",
  'experience': "Meera has extensive experience building production-ready AI applications. She developed a comprehensive Digital Twin RAG system with 95%+ accuracy, created full-stack applications with Prisma and PostgreSQL, implemented enterprise authentication with OAuth, and built custom MCP servers for AI agent communication.",
  'rag': "Meera built an advanced RAG (Retrieval-Augmented Generation) system that serves as a professional digital twin. The system uses vector embeddings with OpenAI API, ChromaDB for efficient storage and retrieval, semantic search capabilities, and generates context-aware responses. The system achieved 95%+ accuracy in responding to recruiter-style queries.",
  'projects': "Meera has completed 5+ production applications including: 1) AI-powered Digital Twin RAG System, 2) Full-stack Person App with Prisma and PostgreSQL, 3) MCP Server for AI agent communication, 4) Enterprise authentication system with OAuth, and 5) Comprehensive AI development portfolio.",
  'certifications': "Meera holds the AI Agent Developer - Full-Stack AI Development Certification (2025), with specializations in Advanced RAG System Implementation, MCP Protocol, and Enterprise Authentication & Security.",
  'education': "Meera completed the AI Agent Developer Certification from AI Agents Workshop Series (2025), a comprehensive 10-week program covering full-stack AI development, MCP servers, RAG systems, and enterprise deployment.",
};

function findBestMatch(query: string): string {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('skill') || queryLower.includes('technical') || queryLower.includes('know')) {
    return mockResponses['skills'];
  }
  if (queryLower.includes('rag') || queryLower.includes('retrieval') || queryLower.includes('digital twin')) {
    return mockResponses['rag'];
  }
  if (queryLower.includes('project') || queryLower.includes('built') || queryLower.includes('developed')) {
    return mockResponses['projects'];
  }
  if (queryLower.includes('experience') || queryLower.includes('work')) {
    return mockResponses['experience'];
  }
  if (queryLower.includes('certification') || queryLower.includes('certified')) {
    return mockResponses['certifications'];
  }
  if (queryLower.includes('education') || queryLower.includes('study') || queryLower.includes('learn')) {
    return mockResponses['education'];
  }
  
  return "Meera is an experienced AI Agent Developer with expertise in full-stack development, RAG systems, and modern web technologies. She has completed 5+ production applications and holds advanced certifications in AI development. Feel free to ask specific questions about her skills, experience, projects, or certifications!";
}

export async function generateRAGResponse(
  query: string
): Promise<{
  response: string;
  relevantDocuments: string[];
  confidence: string;
}> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const response = findBestMatch(query);
  
  return {
    response,
    relevantDocuments: ['Demo Mode - Using mock data'],
    confidence: 'Demo',
  };
}

export async function initializeVectorDB(
  docs: { content: string; metadata: any }[]
) {
  return { 
    success: true, 
    message: `Demo Mode: Using mock responses (no API key needed)` 
  };
}

export async function resetVectorDB() {
  return { success: true, message: "Demo mode reset" };
}
