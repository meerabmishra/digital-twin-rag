"use server"

import { z } from "zod"
import { tool, stepCountIs } from "ai"
import { getAIChatContext, searchVectors, type SearchResult } from "@/lib/vector-search"
import { logConversation } from "@/app/admin/actions/conversation-logs"

// No need to import OpenAI provider when using Vercel AI Gateway
// The AI SDK will automatically use the gateway when model is specified as string

/**
 * Get the AI model from environment variable with fallback
 * Supports any model available through Vercel AI Gateway
 * Examples: "openai/gpt-4o", "anthropic/claude-3.5-sonnet", "meta-llama/llama-3.1-70b-instruct"
 */
function getAIModel(): string {
  const model = process.env.AI_MODEL || "openai/gpt-4o-mini"
  console.log(`Using AI model: ${model}`) // Helpful for debugging
  return model
}

// Schema for conversation message
const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.date().optional(),
  sources: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        type: z.string().optional(),
        relevanceScore: z.number(),
      }),
    )
    .optional(),
})

export type Message = z.infer<typeof MessageSchema>

// Schema for chat session
const ChatSessionSchema = z.object({
  id: z.string(),
  messages: z.array(MessageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ChatSession = z.infer<typeof ChatSessionSchema>

// Options for AI response generation
export interface AIResponseOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  includeSources?: boolean
  responseFormat?: "concise" | "detailed" | "technical"
  personaEnhancement?: string
  userName?: string
}

// Tool handlers for AI SDK tool calling
const toolHandlers = {
  search_professional_content: async ({ query }: { query: string }) => {
    console.log('🔍 TOOL: search_professional_content called with:', query)
    try {
      const results = await searchVectors(query, {
        topK: 10,
        minSimilarityScore: 0.6,
        includeMetadata: true,
      })
      
      console.log(`✅ Found ${results.length} relevant results`)
      
      if (results.length === 0) {
        return {
          content: "No specific information found in professional records.",
          sources: [],
          resultsFound: 0
        }
      }

      const content = results
        .map((r: SearchResult, i: number) => {
          const title = r.metadata?.title || r.metadata?.category || r.metadata?.type || 'Professional Content'
          const text = r.metadata?.content || r.metadata?.text || ''
          return `[${i + 1}] ${title}: ${text}`
        })
        .join('\n\n')

      return {
        content,
        sources: results,
        resultsFound: results.length
      }
    } catch (error) {
      console.error('❌ TOOL ERROR:', error)
      return {
        content: "Error searching professional content.",
        sources: [],
        resultsFound: 0
      }
    }
  },

  get_detailed_experience: async ({ company }: { company?: string }) => {
    console.log('🔍 TOOL: get_detailed_experience called for:', company || 'all companies')
    try {
      const query = company 
        ? `work experience at ${company} job responsibilities achievements projects`
        : `work experience career history job positions responsibilities achievements`

      const results = await searchVectors(query, {
        topK: 8,
        minSimilarityScore: 0.65,
        includeMetadata: true,
      })

      console.log(`✅ Found ${results.length} experience records`)

      if (results.length === 0) {
        return {
          content: company 
            ? `No specific information found about experience at ${company}.`
            : "No detailed work experience information found.",
          sources: [],
          resultsFound: 0
        }
      }

      const content = results
        .map((r: SearchResult, i: number) => {
          const title = r.metadata?.title || r.metadata?.category || r.metadata?.type || 'Experience'
          const text = r.metadata?.content || r.metadata?.text || ''
          return `[${i + 1}] ${title}: ${text}`
        })
        .join('\n\n')

      return {
        content,
        sources: results,
        resultsFound: results.length
      }
    } catch (error) {
      console.error('❌ TOOL ERROR:', error)
      return {
        content: "Error retrieving experience details.",
        sources: [],
        resultsFound: 0
      }
    }
  },

  get_technical_skills: async ({ category }: { category?: string }) => {
    console.log('🔍 TOOL: get_technical_skills called for category:', category || 'all')
    try {
      const query = category 
        ? `${category} technical skills programming languages frameworks tools expertise`
        : `technical skills programming languages frameworks tools expertise proficiency`

      const results = await searchVectors(query, {
        topK: 8,
        minSimilarityScore: 0.65,
        includeMetadata: true,
      })

      console.log(`✅ Found ${results.length} skill records`)

      if (results.length === 0) {
        return {
          content: category 
            ? `No specific information found about ${category} skills.`
            : "No technical skills information found.",
          sources: [],
          resultsFound: 0
        }
      }

      const content = results
        .map((r: SearchResult, i: number) => {
          const title = r.metadata?.title || r.metadata?.category || r.metadata?.type || 'Skills'
          const text = r.metadata?.content || r.metadata?.text || ''
          return `[${i + 1}] ${title}: ${text}`
        })
        .join('\n\n')

      return {
        content,
        sources: results,
        resultsFound: results.length
      }
    } catch (error) {
      console.error('❌ TOOL ERROR:', error)
      return {
        content: "Error retrieving technical skills.",
        sources: [],
        resultsFound: 0
      }
    }
  },

  get_conversation_context: async ({ topic }: { topic: string }) => {
    console.log('🔍 TOOL: get_conversation_context called with:', topic)
    try {
      const results = await searchVectors(topic, {
        topK: 8,
        minSimilarityScore: 0.6,
        includeMetadata: true,
      })

      console.log(`✅ Found ${results.length} contextual results`)

      if (results.length === 0) {
        return {
          content: "No specific contextual information found.",
          sources: [],
          resultsFound: 0
        }
      }

      const content = results
        .map((r: SearchResult, i: number) => {
          const title = r.metadata?.title || r.metadata?.category || r.metadata?.type || 'Context'
          const text = r.metadata?.content || r.metadata?.text || ''
          return `[${i + 1}] ${title}: ${text}`
        })
        .join('\n\n')

      return {
        content,
        sources: results,
        resultsFound: results.length
      }
    } catch (error) {
      console.error('❌ TOOL ERROR:', error)
      return {
        content: "Error retrieving conversation context.",
        sources: [],
        resultsFound: 0
      }
    }
  }
}

/**
 * Create AI SDK tools for tool calling
 */
async function createAiSdkTools() {
  return {
    search_professional_content: tool({
      description: "Search through Meera's professional background. Searches ALL professional content including: work experience at companies, technical skills (React, Next.js, Java, Spring Boot, AWS, PostgreSQL), portfolio projects, achievements, and education.",
      inputSchema: z.object({
        query: z.string().describe("The search query - use the user's exact question or key terms")
      }),
      execute: async ({ query }) => {
        return await toolHandlers.search_professional_content({ query })
      }
    }),

    get_detailed_experience: tool({
      description: "Get detailed information about Meera's work experience at specific companies",
      inputSchema: z.object({
        company: z.string().optional().describe("Optional company name to filter by")
      }),
      execute: async ({ company }) => {
        return await toolHandlers.get_detailed_experience({ company })
      }
    }),

    get_technical_skills: tool({
      description: "Get Meera's technical skills organized by category with proficiency levels",
      inputSchema: z.object({
        category: z.string().optional().describe("Optional skill category to filter by")
      }),
      execute: async ({ category }) => {
        return await toolHandlers.get_technical_skills({ category })
      }
    }),

    get_conversation_context: tool({
      description: "Get contextual information based on the conversation topic using RAG",
      inputSchema: z.object({
        topic: z.string().describe("The topic or question to get relevant context for")
      }),
      execute: async ({ topic }): Promise<any> => {
        return await toolHandlers.get_conversation_context({ topic })
      }
    })
  }
}

/**
 * Extract sources from tool results across all steps
 */
function extractSourcesFromToolResults(steps: any[]): SearchResult[] {
  const sources: SearchResult[] = []
  
  for (const step of steps) {
    for (const toolResult of step.toolResults || []) {
      if (toolResult.toolName === 'search_professional_content' || 
          toolResult.toolName === 'get_conversation_context') {
        const result = toolResult.result as any
        if (result.sources) {
          sources.push(...result.sources)
        }
      }
    }
  }
  
  return sources
}

/**
 * Generate AI response with tool calling
 * LLM decides when to use tools - no pre-fetching
 */
export async function generateAIResponse(
  userMessage: string, 
  conversationHistory: Message[] = [],
  sessionId?: string,
  options?: AIResponseOptions
) {
  const startTime = Date.now()
  
  try {
    // Check if AI Gateway is configured
    if (!process.env.AI_GATEWAY_API_KEY) {
      console.log('⚠️  No AI_GATEWAY_API_KEY found, using mock response')
      
      // Get context using simple search
      let context = ""
      let sources: SearchResult[] = []
      
      try {
        const contextResult = await getAIChatContext(userMessage)
        context = contextResult.context
        sources = contextResult.sources
      } catch (error) {
        console.log("Using fallback context", error)
        context = "Senior Software Engineer with extensive experience in full-stack development. Strong background in enterprise systems and modern web technologies."
      }
      
      const mockResult = generateMockResponse(userMessage, context, sources)
      
      // Log the conversation with enhanced database logging
      const responseTime = Date.now() - startTime
      await logConversation(
        userMessage, 
        mockResult.response, 
        "answered", 
        responseTime,
        sessionId, // Use provided session ID or undefined for backward compatibility
        "mock-response", // modelUsed
        sources, // vectorSources
        context // contextUsed
      )
      
      return mockResult
    }

    // Use Vercel AI SDK with tool calling
    console.log('🤖 Using tool calling - LLM will decide when to search')
    
    try {
      const { generateText } = await import("ai")
      
      // Create AI SDK tools
      const aiSdkTools = await createAiSdkTools()
      
      // Build messages WITHOUT pre-fetched context (let LLM decide when to search)
      const messages = await buildMessages(
        userMessage, 
        conversationHistory, 
        "", // No pre-fetched context - LLM uses tools when needed
        options?.personaEnhancement, 
        options?.userName
      )

      const result = await generateText({
        model: options?.model || getAIModel(),
        messages: messages,
        temperature: 0.7,
        tools: aiSdkTools,
        stopWhen: stepCountIs(5) // Stop after max 5 steps - allows LLM to use tools then respond
      })

      // Extract sources from tool results
      const sources = extractSourcesFromToolResults((result as any).steps || [])
      
      // Count tool usage
      const allSteps = (result as any).steps || []
      const totalToolCalls = allSteps.reduce((acc: number, step: any) => acc + (step.toolCalls?.length || 0), 0)
      const toolsUsedList = allSteps
        .flatMap((step: any) => step.toolCalls || [])
        .map((tc: any) => tc.toolName)
      
      // Build context summary from tool results for logging
      const contextUsed = allSteps
        .flatMap((step: any) => step.toolResults || [])
        .map((tr: any) => `${tr.toolName}`)
        .join(', ') || 'none'

      // Log final summary
      if (totalToolCalls > 0) {
        console.log('📊 FINAL SUMMARY - Tools Used:', {
          totalToolCalls,
          uniqueTools: [...new Set(toolsUsedList)],
          sourcesFound: sources.length
        })
      } else {
        console.log('📊 FINAL SUMMARY - Direct Response (No Tools)')
      }

      const response = {
        response: result.text,
        sources: options?.includeSources !== false ? sources.map((s) => ({
          id: s.id,
          title: s.metadata?.title || "Professional Content",
          type: s.metadata?.chunk_type || "content",
          relevanceScore: s.score,
        })) : [],
        metadata: {
          model: options?.model || getAIModel(),
          responseFormat: options?.responseFormat || "detailed",
          sessionId: sessionId,
          toolCallsCount: totalToolCalls,
          toolsUsed: toolsUsedList
        }
      }

      // Log successful conversation
      const responseTime = Date.now() - startTime
      await logConversation(
        userMessage, 
        result.text, 
        "answered", 
        responseTime,
        sessionId,
        options?.model || getAIModel(),
        sources,
        contextUsed // Tools used instead of pre-fetched context
      )

      return response
    } catch (aiError) {
      // AI generation failed, using mock response with vector search
      console.log('⚠️  AI Gateway failed, falling back to mock with vector search')
      
      let context = ""
      let sources: SearchResult[] = []
      
      try {
        const contextResult = await getAIChatContext(userMessage)
        context = contextResult.context
        sources = contextResult.sources
        console.log(`✅ Retrieved ${sources.length} results for fallback response`)
      } catch (error) {
        console.log("Vector search failed in fallback", error)
      }
      
      const mockResult = generateMockResponse(userMessage, context, sources)
      
      // Log failed attempt with fallback
      const responseTime = Date.now() - startTime
      await logConversation(
        userMessage, 
        mockResult.response, 
        "error", 
        responseTime,
        sessionId,
        "fallback-mock",
        sources,
        `AI Error: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`
      )
      
      return mockResult
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
    
    // Ultimate fallback with vector search
    let sources: SearchResult[] = []
    let context = ""
    
    try {
      const contextResult = await getAIChatContext(userMessage)
      context = contextResult.context
      sources = contextResult.sources
      console.log(`✅ Ultimate fallback retrieved ${sources.length} results`)
    } catch (searchError) {
      console.log("Vector search failed in ultimate fallback", searchError)
    }
    
    const fallbackResponse = sources.length > 0
      ? generateMockResponse(userMessage, context, sources)
      : {
          response: "I apologize, but I'm having trouble processing your question right now. Please try again or rephrase your question.",
          sources: [],
          metadata: {
            model: "error",
            responseFormat: "error",
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
    
    // Log error
    const responseTime = Date.now() - startTime
    await logConversation(
      userMessage,
      fallbackResponse.response,
      "error",
      responseTime,
      sessionId,
      "error",
      [],
      `Critical Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    
    return fallbackResponse
  }
}

/**
 * Create conversation summary for context management
 */
async function createConversationSummary(messages: Message[]) {
  try {
    // Check if conversation summary is enabled
    const summaryEnabled = process.env.ENABLE_CONVERSATION_SUMMARY?.toLowerCase() === 'true'
    
    if (!summaryEnabled) {
      return "Previous conversation covered professional background topics."
    }

    // Try AI-powered summarization if available
    if (process.env.AI_GATEWAY_API_KEY) {
      try {
        const { generateText } = await import("ai")
        
        const conversationText = messages
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n')
          .slice(0, 2000) // Limit input size

        const result = await generateText({
          model: getAIModel(),
          prompt: `Summarize this conversation between a user and Meera Mishra (Software Engineer) in 2-3 sentences, focusing on key topics discussed and main points covered. Keep it concise and relevant for maintaining conversation context.

Conversation:
${conversationText}`,
          temperature: 0.3,
        })

        return result.text.slice(0, 300) // Limit summary length
      } catch (error) {
        console.log('AI summarization failed, using fallback:', error)
      }
    }

    // Fallback to simple summarization
    const userQuestions = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .slice(0, 5) // Limit to first 5 questions for summary

    const assistantResponses = messages
      .filter(msg => msg.role === 'assistant')
      .map(msg => msg.content.slice(0, 200)) // First 200 chars of each response
      .slice(0, 3) // Limit to first 3 responses

    // Simple summary generation
    const topics = userQuestions.join(', ')
    const keyPoints = assistantResponses.join(' ... ')

    return `Topics discussed: ${topics}. Key points covered: ${keyPoints.slice(0, 500)}...`
  } catch (error) {
    console.error('Error creating conversation summary:', error)
    return "Previous conversation covered professional background and experience."
  }
}

async function buildMessages(
  userMessage: string,
  conversationHistory: Message[],
  context: string,
  personaEnhancement?: string,
  userName?: string
) {
  // Create greeting based on whether we have the user's name
  const greeting = userName ? `Hi ${userName}!` : "Hi!"
  
  let systemPrompt = `You are Meera Mishra, a Software Engineer.

${userName ? `When greeting, address the user as ${userName} (e.g., "${greeting}").` : 'Be friendly and professional.'}

CRITICAL RULES:
1. ALWAYS use search_professional_content tool for ANY question about background, experience, projects, or skills
2. NEVER invent or assume details - only use information from tool results
3. If tools return no results, say "I don't have specific information about that in my records"
4. ONLY respond without tools for greetings like "hi" or "hello"

AVAILABLE TOOLS:
- search_professional_content: Primary tool - use for all background questions
- get_detailed_experience: Specific company details
- get_technical_skills: Skills by category
- get_conversation_context: Follow-up questions

${context ? `\n\nCONTEXT:\n${context}` : ''}`

  // Add persona enhancement if provided (for AI-to-AI conversations)
  if (personaEnhancement) {
    systemPrompt += `\n\nADDITIONAL: ${personaEnhancement}`
  }

  // Get conversation limit from environment variable with fallback to 6
  const conversationLimit = parseInt(process.env.CONVERSATION_LIMIT || "6", 10)
  
  // Ensure the limit is reasonable (between 2 and 50)
  const safeLimit = Math.max(2, Math.min(conversationLimit, 50))
  
  console.log(`Using conversation limit: ${safeLimit} messages`)

  // Handle conversation continuity when limit is exceeded
  let messagesToInclude = conversationHistory
  let conversationSummary = ""

  if (conversationHistory.length > safeLimit) {
    // Get older messages that will be truncated
    const olderMessages = conversationHistory.slice(0, -(safeLimit - 1))
    const recentMessages = conversationHistory.slice(-(safeLimit - 1))
    
    // Create a summary of older messages
    conversationSummary = await createConversationSummary(olderMessages)
    
    messagesToInclude = recentMessages
    
    console.log(`📝 Conversation truncated: ${olderMessages.length} older messages summarized, ${recentMessages.length} recent messages included`)
  }

  // Add summary to system prompt if conversation was truncated
  const enhancedSystemPrompt = conversationSummary
    ? `${systemPrompt}\n\nPREVIOUS CONVERSATION SUMMARY: ${conversationSummary}\n\nNote: Continue naturally from the conversation context while responding to the current question.`
    : systemPrompt

  return [
    { role: "system" as const, content: enhancedSystemPrompt },
    ...messagesToInclude.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ]
}

function generateMockResponse(userMessage: string, context: string, sources: SearchResult[]) {
  console.log(`📝 Mock response using ${sources.length} search results from your JSON resume`)
  
  if (sources.length === 0) {
    return {
      response: `I don't have specific information about that in my records. Could you please rephrase your question or ask about my technical skills, work experience, or projects?`,
      sources: [],
    }
  }

  // Extract and categorize content from sources
  const contents = sources.map(s => ({
    text: s.metadata?.content || s.metadata?.text || '',
    category: s.metadata?.category || s.metadata?.type || 'general',
    score: s.score
  })).filter(c => c.text.length > 0)

  if (contents.length === 0) {
    return {
      response: `I found some relevant information but couldn't extract the details. Please try asking in a different way.`,
      sources: sources.map((s) => ({
        id: s.id,
        title: s.metadata?.title || s.metadata?.category || s.metadata?.type || "Professional Content",
        type: s.metadata?.type || s.metadata?.chunk_type || "content",
        relevanceScore: s.score,
      })),
    }
  }

  // Analyze the question to determine response style
  const questionLower = userMessage.toLowerCase()
  let response = ""

  // Generate contextual response based on question type
  if (questionLower.includes("who") || questionLower.includes("tell me about") || questionLower.includes("describe yourself")) {
    // Introduction/Overview question
    const overview = contents.find(c => c.category === 'overview')?.text || 
                     contents[0].text.split('.').slice(0, 2).join('.') + '.'
    response = overview
    
  } else if (questionLower.includes("experience") || questionLower.includes("work") || questionLower.includes("job")) {
    // Experience question
    const experiences = contents.filter(c => c.category === 'experience' || c.text.includes('experience') || c.text.includes('years'))
    if (experiences.length > 0) {
      response = "Here's my professional experience:\n\n" + 
        experiences.slice(0, 3).map(e => "• " + e.text.split('.')[0] + ".").join('\n')
    } else {
      response = contents.slice(0, 2).map(c => c.text.split('.').slice(0, 2).join('.')).join(' ')
    }
    
  } else if (questionLower.includes("skill") || questionLower.includes("tech") || questionLower.includes("tool")) {
    // Skills question
    const skills = contents.filter(c => c.category === 'skills' || c.text.toLowerCase().includes('skill') || c.text.toLowerCase().includes('technical'))
    if (skills.length > 0) {
      response = "My technical skills include:\n\n" + skills[0].text
    } else {
      response = contents[0].text
    }
    
  } else if (questionLower.includes("project") || questionLower.includes("built") || questionLower.includes("created")) {
    // Project question
    const projects = contents.filter(c => c.category === 'project' || c.text.toLowerCase().includes('project'))
    if (projects.length > 0) {
      response = "Here are some projects I've worked on:\n\n" + 
        projects.slice(0, 3).map(p => "• " + p.text.split('.').slice(0, 2).join('.')).join('\n\n')
    } else {
      response = contents.slice(0, 2).map(c => c.text).join('\n\n')
    }
    
  } else {
    // General question - use top results
    response = contents.slice(0, 3).map(c => c.text.split('.').slice(0, 3).join('.')).join('\n\n')
  }

  return {
    response: response.trim(),
    sources: sources.map((s) => ({
      id: s.id,
      title: s.metadata?.title || s.metadata?.category || s.metadata?.type || "Professional Content",
      type: s.metadata?.type || s.metadata?.chunk_type || "content",
      relevanceScore: s.score,
    })),
  }
}

/**
 * Search professional content based on query
 */
export async function searchProfessionalContent(query: string) {
  try {
    const results = await searchVectors(query, {
      topK: 10,
      minSimilarityScore: 0.6,
      includeMetadata: true,
    })

    return {
      results,
      query,
      totalResults: results.length,
    }
  } catch (error) {
    console.error("Search error:", error)
    throw new Error("Failed to search professional content")
  }
}

/**
 * Get suggested questions based on available content
 */
export async function getSuggestedQuestions() {
  
  try {
    if (!process.env.AI_GATEWAY_API_KEY) {
      return [
        "What's your experience with React and Next.js development?",
        "Can you tell me about your full-stack development work?",
        "What technologies and tools do you specialize in?",
        "What's your approach to building scalable web applications?",
        "Can you describe your experience with TypeScript?",
        "What projects have you worked on recently?",
      ]
    }

    // Try to get context and generate dynamic questions
    let context = ""
    try {
      const contextResult = await getAIChatContext("professional experience skills achievements")
      context = contextResult.context
    } catch (error) {
      console.log("Using fallback context for questions", error)
      context = "Software Engineer with expertise in full-stack development using React, Next.js, TypeScript, Node.js. Experience with modern web technologies, database systems, and AI/ML integration."
    }

    const { generateObject } = await import("ai")

    const result = await generateObject({
      model: getAIModel(),
      prompt: `Based on this professional background context, generate 6 engaging questions that would showcase the person's expertise and experience. Make them specific and likely to yield interesting answers.

Context: ${context.slice(0, 2000)}

Generate questions that cover:
- Technical expertise and specific technologies
- Notable achievements and metrics
- Project experiences and challenges solved
- Leadership and collaboration
- Industry-specific knowledge
- Career growth and learning

Format as a JSON array of question strings.`,
      schema: z.object({
        questions: z.array(z.string()).length(6),
      }),
    })

    return result.object.questions
  } catch (error) {
    console.error("Error generating suggested questions:", error)
    // Fallback questions if AI generation fails
    return [
      "What's your experience with React and Next.js development?",
      "Can you tell me about your full-stack development work?",
      "What technologies and tools do you specialize in?",
      "What's your approach to building scalable web applications?",
      "Can you describe your experience with TypeScript?",
      "What projects have you worked on recently?",
    ]
  }
}

/**
 * Validate user input
 */
export async function validateUserInput(input: string) {
  try {
    // Simple validation for now
    const validation = {
      isValid: input.trim().length > 0 && input.trim().length <= 1000,
      sanitizedInput: input.trim(),
      suggestions: [] as string[],
    }

    if (!validation.isValid) {
      validation.suggestions.push("Please enter a question between 1 and 1000 characters")
    }

    return validation
  } catch (error) {
    console.error("Input validation error:", error)
    return {
      isValid: false,
      sanitizedInput: "",
      suggestions: ["Please try again with a valid question"],
    }
  }
}

/**
 * Summarize conversation for context management
 */
export async function summarizeConversation(messages: Message[]) {
  try {
    // Simple summary for now
    return {
      summary: `Conversation with ${messages.length} messages about professional background and experience.`,
      keyTopics: ["professional experience", "technical skills", "career achievements"],
      lastActivity: new Date(),
    }
  } catch (error) {
    console.error("Conversation summary error:", error)
    return {
      summary: "Unable to summarize conversation",
      keyTopics: [],
      lastActivity: new Date(),
    }
  }
}
