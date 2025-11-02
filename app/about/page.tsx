import Link from 'next/link';
import { Brain, Database, Search, Cpu, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Twin RAG</span>
            </Link>
            <Link href="/" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About Digital Twin RAG System
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              This Digital Twin RAG (Retrieval-Augmented Generation) system represents the completion of 
              <strong> Steps 3 and 4</strong> of the comprehensive digital-twin-workshop methodology. 
              It serves as an AI-powered professional assistant capable of intelligently responding to 
              recruiter and hiring team queries about professional experience, skills, and achievements.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">System Architecture</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Database className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vector Database</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  ChromaDB for efficient storage and retrieval of vector embeddings, enabling semantic search capabilities
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Cpu className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Embeddings</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  OpenAI text-embedding-3-small model for generating high-quality vector representations of professional content
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Search className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Semantic Search</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Advanced similarity search using cosine distance to find the most relevant professional information
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Brain className="h-6 w-6 text-orange-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Response Generation</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  GPT-4o-mini for generating natural, context-aware responses based on retrieved professional data
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Implementation Details</h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 3: RAG System Foundation</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✅ ChromaDB integration for vector storage</li>
                <li>✅ OpenAI API integration for embeddings and completions</li>
                <li>✅ Document chunking and metadata management</li>
                <li>✅ Semantic search with configurable result count</li>
                <li>✅ Context-aware response generation</li>
                <li>✅ Confidence scoring based on retrieval quality</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 4: Professional Profile Optimization</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✅ STAR methodology implementation (Situation-Task-Action-Result)</li>
                <li>✅ Comprehensive professional data structuring</li>
                <li>✅ Multiple document chunks for optimal retrieval</li>
                <li>✅ Category-based organization (experience, skills, education, achievements)</li>
                <li>✅ Keyword optimization for recruiter queries</li>
                <li>✅ Metadata tagging for enhanced search accuracy</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Technology Stack</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900 dark:text-white">Next.js 15</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">React Framework</p>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900 dark:text-white">React 19</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">UI Library</p>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900 dark:text-white">TypeScript</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type Safety</p>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900 dark:text-white">ChromaDB</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vector Database</p>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900 dark:text-white">OpenAI API</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Embeddings & LLM</p>
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900 dark:text-white">Tailwind CSS</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Styling</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h2>
            
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 mt-1">1</span>
                <div>
                  <strong>Real-time Query Processing:</strong> Instant responses to professional queries with semantic understanding
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 mt-1">2</span>
                <div>
                  <strong>Context-Aware Responses:</strong> Retrieves relevant professional information and generates natural answers
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 mt-1">3</span>
                <div>
                  <strong>Confidence Scoring:</strong> Provides transparency about response quality based on retrieval accuracy
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 mt-1">4</span>
                <div>
                  <strong>STAR Methodology:</strong> Professional experiences structured for optimal recruiter understanding
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 mt-1">5</span>
                <div>
                  <strong>Comprehensive Testing:</strong> Validated with 20+ recruiter-style questions and quality assessments
                </div>
              </li>
            </ul>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-600 p-6 rounded">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Deployment Ready</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This system is optimized for professional recruiter interactions and demonstrates advanced 
                RAG system implementation capabilities. It showcases expertise in AI integration, modern 
                web development, and professional content structuring.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
