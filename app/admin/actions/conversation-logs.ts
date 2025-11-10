"use server"

import type { SearchResult } from "@/lib/vector-search"

// This is a placeholder for conversation logging
// In production, you would save this to a database

export interface ConversationLog {
  id: string
  userMessage: string
  assistantResponse: string
  status: "answered" | "error" | "partial"
  responseTime: number
  timestamp: Date
  sessionId?: string
  modelUsed?: string
  vectorSources?: SearchResult[]
  contextUsed?: string
}

// In-memory storage for development (replace with database in production)
const conversationLogs: ConversationLog[] = []

/**
 * Log a conversation interaction
 */
export async function logConversation(
  userMessage: string,
  assistantResponse: string,
  status: "answered" | "error" | "partial",
  responseTime: number,
  sessionId?: string,
  modelUsed?: string,
  vectorSources?: SearchResult[],
  contextUsed?: string
) {
  try {
    const log: ConversationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userMessage,
      assistantResponse,
      status,
      responseTime,
      timestamp: new Date(),
      sessionId,
      modelUsed,
      vectorSources,
      contextUsed,
    }

    // In production, save to database
    conversationLogs.push(log)

    console.log(`📝 Logged conversation: ${status} | ${responseTime}ms | Model: ${modelUsed || 'unknown'}`)

    return { success: true, logId: log.id }
  } catch (error) {
    console.error("Error logging conversation:", error)
    return { success: false, error: "Failed to log conversation" }
  }
}

/**
 * Get conversation logs (for admin dashboard)
 */
export async function getConversationLogs(limit: number = 50) {
  try {
    // In production, fetch from database
    return conversationLogs
      .slice(-limit)
      .reverse()
  } catch (error) {
    console.error("Error fetching conversation logs:", error)
    return []
  }
}

/**
 * Get conversation statistics
 */
export async function getConversationStats() {
  try {
    const total = conversationLogs.length
    const answered = conversationLogs.filter(log => log.status === "answered").length
    const errors = conversationLogs.filter(log => log.status === "error").length
    const avgResponseTime = conversationLogs.length > 0
      ? conversationLogs.reduce((sum, log) => sum + log.responseTime, 0) / conversationLogs.length
      : 0

    return {
      total,
      answered,
      errors,
      avgResponseTime: Math.round(avgResponseTime),
    }
  } catch (error) {
    console.error("Error fetching conversation stats:", error)
    return {
      total: 0,
      answered: 0,
      errors: 0,
      avgResponseTime: 0,
    }
  }
}
