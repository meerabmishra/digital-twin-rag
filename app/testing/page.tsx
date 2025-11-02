'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TestTube, ArrowLeft, Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface TestQuery {
  id: number;
  category: string;
  question: string;
  expectedContent: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const testQueries: TestQuery[] = [
  {
    id: 1,
    category: "Skills & Expertise",
    question: "What are Meera's main technical skills?",
    expectedContent: ["Next.js", "React", "TypeScript", "AI/ML", "RAG"],
    difficulty: "Easy"
  },
  {
    id: 2,
    category: "Skills & Expertise",
    question: "Does Meera have experience with AI and machine learning?",
    expectedContent: ["AI", "RAG", "OpenAI", "vector embeddings"],
    difficulty: "Easy"
  },
  {
    id: 3,
    category: "Experience",
    question: "Tell me about Meera's experience with RAG systems",
    expectedContent: ["RAG", "vector embeddings", "ChromaDB", "semantic search", "Digital Twin"],
    difficulty: "Medium"
  },
  {
    id: 4,
    category: "Experience",
    question: "What full-stack projects has Meera completed?",
    expectedContent: ["Person App", "Prisma", "PostgreSQL", "Next.js", "CRUD"],
    difficulty: "Medium"
  },
  {
    id: 5,
    category: "Experience",
    question: "Has Meera worked with database integration?",
    expectedContent: ["Prisma", "PostgreSQL", "Vercel Neon", "database"],
    difficulty: "Easy"
  },
  {
    id: 6,
    category: "Authentication",
    question: "What experience does Meera have with authentication and security?",
    expectedContent: ["Auth.js", "OAuth", "authentication", "security"],
    difficulty: "Medium"
  },
  {
    id: 7,
    category: "MCP Development",
    question: "Tell me about Meera's MCP server development experience",
    expectedContent: ["MCP", "Model Context Protocol", "server development", "AI agents"],
    difficulty: "Hard"
  },
  {
    id: 8,
    category: "Deployment",
    question: "What deployment experience does Meera have?",
    expectedContent: ["Vercel", "deployment", "production", "24/7"],
    difficulty: "Easy"
  },
  {
    id: 9,
    category: "Tools & Workflow",
    question: "What development tools and AI assistants has Meera used?",
    expectedContent: ["GitHub Copilot", "Claude Desktop", "VS Code", "AI-assisted"],
    difficulty: "Medium"
  },
  {
    id: 10,
    category: "Achievements",
    question: "What are Meera's key professional achievements?",
    expectedContent: ["5+ production applications", "RAG system", "95% accuracy"],
    difficulty: "Easy"
  },
  {
    id: 11,
    category: "STAR - Situation",
    question: "What challenge did Meera face when building the Digital Twin system?",
    expectedContent: ["recruiter queries", "professional assistant", "accurate"],
    difficulty: "Medium"
  },
  {
    id: 12,
    category: "STAR - Action",
    question: "What specific actions did Meera take to build the RAG system?",
    expectedContent: ["architected", "vector embeddings", "ChromaDB", "STAR methodology"],
    difficulty: "Hard"
  },
  {
    id: 13,
    category: "STAR - Result",
    question: "What were the results of Meera's Digital Twin RAG project?",
    expectedContent: ["95%", "accuracy", "functional", "recruiter"],
    difficulty: "Medium"
  },
  {
    id: 14,
    category: "Frameworks",
    question: "What frontend frameworks does Meera know?",
    expectedContent: ["React 19", "Next.js 15", "TypeScript"],
    difficulty: "Easy"
  },
  {
    id: 15,
    category: "Cloud & Infrastructure",
    question: "What cloud platforms has Meera worked with?",
    expectedContent: ["Vercel", "AWS", "cloud deployment"],
    difficulty: "Easy"
  },
  {
    id: 16,
    category: "Problem Solving",
    question: "Give an example of a complex problem Meera solved",
    expectedContent: ["RAG", "semantic search", "professional queries", "accuracy"],
    difficulty: "Hard"
  },
  {
    id: 17,
    category: "Certifications",
    question: "What certifications does Meera have?",
    expectedContent: ["AI Agent Developer", "RAG System", "MCP Protocol"],
    difficulty: "Easy"
  },
  {
    id: 18,
    category: "Education",
    question: "What is Meera's educational background?",
    expectedContent: ["AI Agent Developer", "Workshop Series", "10-week"],
    difficulty: "Easy"
  },
  {
    id: 19,
    category: "Integration",
    question: "Has Meera integrated AI models into applications?",
    expectedContent: ["OpenAI", "embeddings", "GPT", "integration"],
    difficulty: "Medium"
  },
  {
    id: 20,
    category: "Soft Skills",
    question: "What are Meera's soft skills and professional qualities?",
    expectedContent: ["Problem Solving", "Communication", "Continuous Learning"],
    difficulty: "Easy"
  },
  {
    id: 21,
    category: "Complex Query",
    question: "How did Meera structure professional data for optimal AI retrieval?",
    expectedContent: ["STAR methodology", "structured", "embeddings", "chunks", "metadata"],
    difficulty: "Hard"
  },
  {
    id: 22,
    category: "Technical Details",
    question: "What specific technologies did Meera use for vector embeddings?",
    expectedContent: ["OpenAI", "text-embedding", "ChromaDB", "vector"],
    difficulty: "Medium"
  },
  {
    id: 23,
    category: "Portfolio",
    question: "How many production applications has Meera built?",
    expectedContent: ["5+", "production", "applications"],
    difficulty: "Easy"
  },
  {
    id: 24,
    category: "Best Practices",
    question: "What best practices did Meera follow in authentication implementation?",
    expectedContent: ["OAuth", "security", "session management", "enterprise"],
    difficulty: "Hard"
  },
  {
    id: 25,
    category: "Overall Assessment",
    question: "Why should we hire Meera as an AI Agent Developer?",
    expectedContent: ["production-ready", "RAG", "full-stack", "AI", "modern"],
    difficulty: "Hard"
  }
];

export default function TestingPage() {
  const [runningTests, setRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<Map<number, { passed: boolean; response: string; confidence: string }>>(new Map());

  const runSingleTest = async (query: TestQuery) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.question }),
      });

      const data = await response.json();

      if (data.success) {
        const responseText = data.response.toLowerCase();
        const matchCount = query.expectedContent.filter(content => 
          responseText.includes(content.toLowerCase())
        ).length;
        
        const passed = matchCount >= Math.ceil(query.expectedContent.length * 0.6);

        setTestResults(prev => new Map(prev).set(query.id, {
          passed,
          response: data.response,
          confidence: data.confidence
        }));
      }
    } catch (error) {
      setTestResults(prev => new Map(prev).set(query.id, {
        passed: false,
        response: 'Error running test',
        confidence: 'N/A'
      }));
    }
  };

  const runAllTests = async () => {
    setRunningTests(true);
    setTestResults(new Map());

    for (const query of testQueries) {
      await runSingleTest(query);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setRunningTests(false);
  };

  const passedTests = Array.from(testResults.values()).filter(r => r.passed).length;
  const totalTests = testResults.size;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TestTube className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Twin RAG</span>
            </Link>
            <Link href="/" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TestTube className="h-12 w-12 text-purple-600 mr-4" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  RAG System Testing Suite
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  25 Recruiter-Style Queries with Quality Assessments
                </p>
              </div>
            </div>
            <button
              onClick={runAllTests}
              disabled={runningTests}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition font-semibold"
            >
              {runningTests ? (
                <>
                  <Clock className="animate-spin h-5 w-5 mr-2" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Run All Tests
                </>
              )}
            </button>
          </div>

          {totalTests > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Total Tests</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{totalTests}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Tests Passed</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-300">{passedTests}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">Pass Rate</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">{passRate}%</p>
              </div>
            </div>
          )}

          <div className="bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-600 p-4 rounded mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Testing Methodology</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Each query is evaluated against expected content keywords. A test passes if at least 60% of expected keywords
              appear in the RAG system response. Confidence scores are provided based on retrieval quality.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {testQueries.map((query) => {
            const result = testResults.get(query.id);
            const difficultyColor = 
              query.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
              query.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';

            return (
              <div
                key={query.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Test #{query.id}
                      </span>
                      <span className="text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded">
                        {query.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${difficultyColor}`}>
                        {query.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {query.question}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expected content: {query.expectedContent.join(', ')}
                    </p>
                  </div>
                  {result && (
                    <div className="ml-4">
                      {result.passed ? (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                  )}
                </div>

                {result && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        RAG Response:
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Confidence: {result.confidence}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {result.response}
                    </p>
                  </div>
                )}

                {!result && totalTests > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Test not yet run
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-8 text-white">
          <div className="flex items-start">
            <AlertTriangle className="h-8 w-8 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Quality Assessment Notes</h2>
              <ul className="space-y-2 text-purple-100">
                <li>• Tests cover all major categories: skills, experience, STAR methodology, achievements</li>
                <li>• Difficulty levels range from Easy (basic info retrieval) to Hard (complex synthesis)</li>
                <li>• Expected content validation ensures accuracy of RAG responses</li>
                <li>• Confidence scoring provides transparency about retrieval quality</li>
                <li>• Testing suite demonstrates recruiter-ready system performance</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
