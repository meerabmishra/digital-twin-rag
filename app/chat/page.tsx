'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Brain, Send, Loader2, AlertCircle } from 'lucide-react';
import { generateAIResponse, getSuggestedQuestions, type Message } from '@/app/actions/chat';

export default function ChatPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState('');
  const [chatError, setChatError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // Initialize vector database
      const response = await fetch('/api/initialize', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsInitialized(true);
        
        // Load suggested questions
        try {
          const questions = await getSuggestedQuestions();
          setSuggestedQuestions(questions);
        } catch (error) {
          console.error('Failed to load suggested questions:', error);
          // Use fallback questions
          setSuggestedQuestions([
            "What are Meera's main technical skills?",
            "Tell me about Meera's experience with AI and RAG systems",
            "What projects has Meera completed?",
            "What certifications does Meera have?",
          ]);
        }
      } else {
        const errorMsg = data.details || data.error || data.message || 'Failed to initialize vector database';
        setInitError(errorMsg);
      }
    } catch (error: any) {
      setInitError(`Initialization error: ${error.message || 'Unknown error'}`);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInitialized || isPending || !inputValue?.trim()) {
      return;
    }
    
    await sendMessage(inputValue.trim());
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsPending(true);
    setChatError('');
    
    try {
      // Call server action with streaming
      const result = await generateAIResponse(
        content,
        messages,
        sessionId,
        {
          includeSources: true,
          responseFormat: 'detailed',
        }
      );
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        sources: result.sources,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setChatError(error.message || 'Failed to send message');
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
      setInputValue(content); // Restore input
    } finally {
      setIsPending(false);
    }
  };

  const handleSampleQuestion = async (question: string) => {
    if (!isInitialized || isPending) {
      return;
    }
    
    setInputValue(question);
    await sendMessage(question);
  };

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
                <div>
                  <p className="text-red-700 dark:text-red-300 font-semibold">Initialization Error</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{initError}</p>
                </div>
              </div>
            </div>
          )}

          {!isInitialized && !initError && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 m-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
                  <p className="text-blue-700 dark:text-blue-300">Initializing vector database...</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 ml-7">
                This may take a moment. Processing embeddings for your profile...
              </p>
            </div>
          )}

          {initError && (
            <div className="mt-4 mx-4">
              <button
                onClick={initializeChat}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <Brain className="h-5 w-5 mr-2" />
                Retry Initialization
              </button>
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
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSampleQuestion(q)}
                      disabled={!isInitialized || isPending}
                      className="block w-full text-left px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
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
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <p className="text-xs font-semibold mb-2 opacity-75">Sources:</p>
                      <div className="space-y-1">
                        {message.sources.slice(0, 3).map((source, idx) => (
                          <div key={idx} className="text-xs opacity-70">
                            <span className="font-medium">{source.title || 'Professional Content'}</span>
                            <span className="ml-2">({Math.round(source.relevanceScore * 100)}% match)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start items-center space-x-2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              </div>
            )}

            {chatError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-700 dark:text-red-300 text-sm font-semibold">
                      Chat Error
                    </p>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      {chatError || 'An error occurred. Please try again.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatError('')}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleFormSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about professional experience, skills, projects..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                disabled={!isInitialized || isPending}
              />
              <button
                type="submit"
                disabled={!isInitialized || isPending || !inputValue?.trim()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
            {isPending && (
              <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Processing with AI...
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
