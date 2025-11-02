import Link from 'next/link';
import { User, ArrowLeft, Star, Briefcase, GraduationCap, Award, Code } from 'lucide-react';
import { professionalProfile } from '@/lib/profile-data';

export default function ProfileDataPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <User className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Twin RAG</span>
            </Link>
            <Link href="/" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <User className="h-12 w-12 text-indigo-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Professional Profile Data
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                STAR Methodology Structured Content for Optimal RAG Retrieval
              </p>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{professionalProfile.name}</h2>
            <p className="text-xl text-indigo-600 dark:text-indigo-400 mb-4">{professionalProfile.title}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{professionalProfile.summary}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Code className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Skills & Expertise</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {professionalProfile.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {professionalProfile.skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <GraduationCap className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h2>
          </div>
          
          {professionalProfile.education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
              <p className="text-gray-600 dark:text-gray-400">{edu.institution} • {edu.year}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{edu.description}</p>
            </div>
          ))}
        </div>

        {/* STAR Experiences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">STAR Methodology Experiences</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Situation • Task • Action • Result
              </p>
            </div>
          </div>

          {professionalProfile.starExperiences.map((exp, index) => (
            <div
              key={index}
              className="mb-8 last:mb-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{exp.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {exp.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-semibold"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">📍 SITUATION</h4>
                  <p className="text-gray-700 dark:text-gray-300">{exp.situation}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 mb-2">🎯 TASK</h4>
                  <p className="text-gray-700 dark:text-gray-300">{exp.task}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">⚡ ACTIONS</h4>
                  <ul className="space-y-2">
                    {exp.action.map((action, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2">🏆 RESULT</h4>
                  <p className="text-gray-700 dark:text-gray-300">{exp.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Award className="h-8 w-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Key Achievements</h2>
          </div>
          
          <ul className="space-y-3">
            {professionalProfile.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm mr-3 mt-1">✓</span>
                <p className="text-gray-700 dark:text-gray-300">{achievement}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Briefcase className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Certifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalProfile.certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-600"
              >
                <p className="text-gray-900 dark:text-white font-semibold">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Organization Info */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Content Organization for RAG</h2>
          <p className="mb-4 text-indigo-100">
            This professional profile is structured for optimal AI retrieval using the following strategies:
          </p>
          <ul className="space-y-2 text-indigo-100">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>STAR Methodology:</strong> Each experience broken down into Situation, Task, Action, and Result components</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Multiple Chunks:</strong> Content divided into discrete, searchable segments with metadata</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Keyword Optimization:</strong> Strategic keywords for recruiter-style queries</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Category Organization:</strong> Content grouped by type (experience, skills, education, achievements)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Rich Metadata:</strong> Each document chunk tagged with category, type, and project information</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
