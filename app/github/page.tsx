import Link from 'next/link';
import { Github, ExternalLink, ArrowLeft, Code, FolderTree } from 'lucide-react';

export default function GitHubPage() {
  const repoUrl = "https://github.com/yourusername/digital-twin-rag";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-indigo-600" />
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
          <div className="flex items-center mb-6">
            <Github className="h-12 w-12 text-gray-900 dark:text-white mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                GitHub Repository
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Complete implementation with source code and documentation
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Digital Twin RAG System</h2>
                <p className="text-indigo-100">
                  Week 6 Deliverable - Steps 3 & 4 Implementation
                </p>
              </div>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center"
              >
                View on GitHub
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FolderTree className="mr-3 h-6 w-6 text-indigo-600" />
                Project Structure
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg font-mono text-sm">
                <pre className="text-gray-800 dark:text-gray-200 overflow-x-auto">
{`digital-twin/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # RAG query endpoint
│   │   └── initialize/
│   │       └── route.ts          # Vector DB initialization
│   ├── about/
│   │   └── page.tsx              # System architecture docs
│   ├── chat/
│   │   └── page.tsx              # Interactive chat interface
│   ├── github/
│   │   └── page.tsx              # Repository information
│   ├── profile-data/
│   │   └── page.tsx              # STAR methodology profile
│   ├── testing/
│   │   └── page.tsx              # Testing suite & queries
│   ├── layout.tsx
│   ├── page.tsx                  # Home page
│   └── globals.css
├── lib/
│   ├── rag.ts                    # RAG system implementation
│   └── profile-data.ts           # STAR structured content
├── public/
├── .env.local                    # Environment configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js`}
                </pre>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Code className="mr-3 h-6 w-6 text-green-600" />
                Key Implementation Files
              </h2>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">lib/rag.ts</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Core RAG system with ChromaDB integration, OpenAI embeddings, semantic search, and response generation
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• Vector embedding generation using OpenAI API</li>
                    <li>• Document storage and retrieval with ChromaDB</li>
                    <li>• Semantic search with confidence scoring</li>
                    <li>• Context-aware response generation with GPT-4o-mini</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">lib/profile-data.ts</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Professional profile structured using STAR methodology for optimal AI retrieval
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• STAR methodology implementation (Situation-Task-Action-Result)</li>
                    <li>• Comprehensive professional experience documentation</li>
                    <li>• Skills, education, and achievements organization</li>
                    <li>• Document chunking with metadata for enhanced search</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">app/chat/page.tsx</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Interactive chat interface for real-time professional queries
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• Real-time query processing</li>
                    <li>• Message history and context management</li>
                    <li>• Confidence scoring display</li>
                    <li>• Sample questions for testing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Setup Instructions</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <ol className="space-y-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">1</span>
                    <div>
                      <strong>Clone the repository:</strong>
                      <code className="block bg-white dark:bg-gray-800 p-2 rounded mt-2 text-sm">
                        git clone {repoUrl}.git
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">2</span>
                    <div>
                      <strong>Install dependencies:</strong>
                      <code className="block bg-white dark:bg-gray-800 p-2 rounded mt-2 text-sm">
                        npm install
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">3</span>
                    <div>
                      <strong>Configure environment variables:</strong>
                      <code className="block bg-white dark:bg-gray-800 p-2 rounded mt-2 text-sm">
                        cp .env.local.example .env.local<br />
                        # Add your OPENAI_API_KEY
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">4</span>
                    <div>
                      <strong>Start ChromaDB server:</strong>
                      <code className="block bg-white dark:bg-gray-800 p-2 rounded mt-2 text-sm">
                        docker run -p 8000:8000 chromadb/chroma
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">5</span>
                    <div>
                      <strong>Run the development server:</strong>
                      <code className="block bg-white dark:bg-gray-800 p-2 rounded mt-2 text-sm">
                        npm run dev
                      </code>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-600 p-6 rounded">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Repository Features</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✅ Complete implementation of Steps 3-4</li>
                <li>✅ Production-ready code with TypeScript</li>
                <li>✅ Comprehensive documentation and comments</li>
                <li>✅ Testing suite with sample queries</li>
                <li>✅ Environment configuration examples</li>
                <li>✅ Deployment instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
