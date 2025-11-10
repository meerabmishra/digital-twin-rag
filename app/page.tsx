import Link from 'next/link';
import { Brain, User, Github, TestTube, Database, Upload } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Twin RAG</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/github" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                GitHub
              </Link>
              <Link href="/testing" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                Testing
              </Link>
              <Link href="/profile-data" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                Profile Data
              </Link>
              <Link href="/migrate-resume" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                Migrate Resume
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Digital Twin RAG System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-powered career assistant with advanced retrieval-augmented generation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">RAG System</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Advanced retrieval-augmented generation with vector embeddings and semantic search
            </p>
            <Link href="/chat" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
              Start Chat
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Upload className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Migration</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Convert your JSON resume to vector embeddings and upload to the database
            </p>
            <Link href="/migrate-resume" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              Migrate Now
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <User className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">STAR Methodology</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Professional profile structured using Situation-Task-Action-Result framework
            </p>
            <Link href="/profile-data" className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
              View Profile
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <TestTube className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Testing Suite</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              20+ recruiter-style queries with quality assessments and response analysis
            </p>
            <Link href="/testing" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition">
              View Tests
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vector Database</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              ChromaDB integration with optimized embeddings for accurate retrieval
            </p>
            <Link href="/about" className="inline-block bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition">
              Learn More
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm mr-3">✓</div>
              <p className="text-gray-700 dark:text-gray-300">Advanced vector embeddings with OpenAI</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm mr-3">✓</div>
              <p className="text-gray-700 dark:text-gray-300">Semantic search and retrieval</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm mr-3">✓</div>
              <p className="text-gray-700 dark:text-gray-300">STAR methodology profile structure</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm mr-3">✓</div>
              <p className="text-gray-700 dark:text-gray-300">Recruiter-optimized responses</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm mr-3">✓</div>
              <p className="text-gray-700 dark:text-gray-300">Real-time query processing</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm mr-3">✓</div>
              <p className="text-gray-700 dark:text-gray-300">Comprehensive testing documentation</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Week 6 Deliverable: Digital Twin RAG System (Steps 3-4)
          </p>
        </div>
      </footer>
    </div>
  );
}
