'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Send, Loader2, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidence?: string;
  relevantDocs?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState('');

  useEffect(() => {
    // Initialize vector database on component mount
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      const response = await fetch('/api/initialize', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsInitialized(true);
      } else {
        const errorMsg = data.details || data.error || 'Failed to initialize vector database';
        if (errorMsg.includes('quota') || errorMsg.includes('429')) {
          setInitError('OpenAI API quota exceeded. Please add credits to your OpenAI account at https://platform.openai.com/account/billing');
        } else if (errorMsg.includes('API key')) {
          setInitError('Invalid OpenAI API key. Please check your .env.local file.');
        } else {
          setInitError(errorMsg);
        }
      }
    } catch (error: any) {
      setInitError(`Initialization error: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          confidence: data.confidence,
          relevantDocs: data.relevantDocuments,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "What are Meera's main technical skills?",
    "Tell me about Meera's experience with AI and RAG systems",
    "What projects has Meera completed?",
    "What certifications does Meera have?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Twin RAG</span>
            </Link>
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 text-white p-6">
            <h1 className="text-3xl font-bold flex items-center">
              <Brain className="mr-3 h-8 w-8" />
              Digital Twin Chat
            </h1>
            <p className="mt-2 text-indigo-100">
              Ask me anything about Meera's professional experience, skills, and achievements
            </p>
          </div>

          {initError && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 m-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 dark:text-red-300">{initError}</p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Run: <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">docker run -p 8000:8000 chromadb/chroma</code>
              </p>
            </div>
          )}

          {!isInitialized && !initError && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 m-4">
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
                <p className="text-blue-700 dark:text-blue-300">Initializing vector database...</p>
              </div>
            </div>
          )}

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && isInitialized && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start a conversation by asking a question
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Try these sample questions:
                  </p>
                  {sampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="block w-full text-left px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.confidence && (
                    <p className="text-xs mt-2 opacity-75">
                      Confidence: {message.confidence}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about professional experience, skills, projects..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                disabled={!isInitialized || isLoading}
              />
              <button
                type="submit"
                disabled={!isInitialized || isLoading || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
