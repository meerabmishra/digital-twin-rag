'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, Database, FileJson, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function MigrateResumePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMigration = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/migrate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || data.details || 'Migration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to migration API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-purple-300 hover:text-purple-200 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Resume Migration
          </h1>
          <p className="text-gray-300">
            Convert your structured JSON resume into vector embeddings and upload to the vector database
          </p>
        </div>

        {/* Migration Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-semibold text-white">
              Vector Database Migration
            </h2>
          </div>

          <div className="space-y-6">
            {/* Info Section */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <FileJson className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-200">
                  <p className="font-semibold mb-2">What this does:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Reads your structured JSON resume</li>
                    <li>Creates semantic chunks for better retrieval</li>
                    <li>Generates vector embeddings using Upstash</li>
                    <li>Uploads to your vector database</li>
                    <li>Makes your resume searchable via AI chat</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Migration Button */}
            <button
              onClick={handleMigration}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Migrating Resume...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Start Migration
                </>
              )}
            </button>

            {/* Success Result */}
            {result && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">
                      Migration Successful!
                    </h3>
                    <div className="space-y-2 text-sm text-gray-200">
                      <p>
                        <span className="font-semibold">Resume:</span> {result.resumeName}
                      </p>
                      <p>
                        <span className="font-semibold">Documents Created:</span> {result.documentCount}
                      </p>
                      {result.categories && (
                        <div className="mt-3">
                          <p className="font-semibold mb-2">Category Breakdown:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(result.categories).map(([category, count]) => (
                              <div
                                key={category}
                                className="bg-white/5 rounded px-3 py-2"
                              >
                                <span className="text-purple-300">{category}:</span>{' '}
                                <span className="font-semibold">{count as number}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="mt-4 text-gray-300">
                        Your resume is now searchable! Try asking questions in the{' '}
                        <Link href="/chat" className="text-purple-400 hover:text-purple-300 underline">
                          chat interface
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Migration Failed
                    </h3>
                    <p className="text-sm text-gray-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Technical Details:
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• <span className="text-gray-300">Vector DB:</span> Upstash Vector (automatic embeddings)</li>
                <li>• <span className="text-gray-300">Source:</span> C:\Users\Meera\Downloads\meera_mishra_resume_structured.json</li>
                <li>• <span className="text-gray-300">Format:</span> Semantic chunks with metadata</li>
                <li>• <span className="text-gray-300">Categories:</span> Overview, Skills, Experience, Education, Projects, Goals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/chat"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-200"
          >
            <h3 className="text-white font-semibold mb-1">Chat Interface</h3>
            <p className="text-sm text-gray-400">Test your migrated data</p>
          </Link>
          <Link
            href="/api/initialize"
            target="_blank"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-200"
          >
            <h3 className="text-white font-semibold mb-1">Initialize DB</h3>
            <p className="text-sm text-gray-400">Setup default profile data</p>
          </Link>
          <Link
            href="/profile-data"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-200"
          >
            <h3 className="text-white font-semibold mb-1">Profile Data</h3>
            <p className="text-sm text-gray-400">View current data structure</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
