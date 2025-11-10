import { Index } from "@upstash/vector"

// Initialize Upstash Vector client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

export interface SearchResult {
  id: string
  score: number
  metadata?: {
    content?: string
    text?: string
    title?: string
    category?: string
    type?: string
    source?: string
    chunk_type?: string
    [key: string]: any
  }
}

export interface SearchOptions {
  topK?: number
  minSimilarityScore?: number
  includeMetadata?: boolean
  filter?: Record<string, any>
}

/**
 * Search vectors in Upstash database
 */
export async function searchVectors(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const {
    topK = 10,
    minSimilarityScore = 0.6,
    includeMetadata = true,
  } = options

  try {
    console.log(`🔍 Searching vectors for: "${query}"`)
    
    const results = await index.query({
      data: query,
      topK,
      includeMetadata,
    })

    // Filter by similarity score and format results
    const filteredResults = results
      .filter((r) => r.score >= minSimilarityScore)
      .map((r) => ({
        id: String(r.id),
        score: r.score,
        metadata: r.metadata as any,
      }))

    console.log(`✅ Found ${filteredResults.length} results above threshold ${minSimilarityScore}`)
    
    return filteredResults
  } catch (error) {
    console.error("Error searching vectors:", error)
    throw new Error("Failed to search vector database")
  }
}

/**
 * Get AI chat context from vector search
 */
export async function getAIChatContext(query: string) {
  try {
    const results = await searchVectors(query, {
      topK: 8,
      minSimilarityScore: 0.6,
      includeMetadata: true,
    })

    if (results.length === 0) {
      return {
        context: "No relevant information found in the knowledge base.",
        sources: [],
        confidence: 0,
      }
    }

    // Build context from search results
    const context = results
      .map((r, i) => {
        const title = r.metadata?.title || r.metadata?.category || r.metadata?.type || "Professional Content"
        const text = r.metadata?.content || r.metadata?.text || ""
        return `[${i + 1}] ${title}:\n${text}`
      })
      .join("\n\n")

    // Calculate average confidence
    const avgConfidence = results.reduce((sum, r) => sum + r.score, 0) / results.length

    return {
      context,
      sources: results,
      confidence: avgConfidence,
    }
  } catch (error) {
    console.error("Error getting AI chat context:", error)
    return {
      context: "Error retrieving context from knowledge base.",
      sources: [],
      confidence: 0,
    }
  }
}

/**
 * Upsert vectors to database
 */
export async function upsertVectors(vectors: Array<{
  id: string
  data: string | number[]
  metadata?: Record<string, any>
}>) {
  try {
    console.log(`📤 Upserting ${vectors.length} vectors...`)
    
    // Transform vectors to Upstash format
    const upstashVectors = vectors.map(v => ({
      id: v.id,
      data: v.data,
      metadata: v.metadata
    }))
    
    await index.upsert(upstashVectors as any)
    
    console.log(`✅ Successfully upserted ${vectors.length} vectors`)
    
    return { success: true, count: vectors.length }
  } catch (error) {
    console.error("Error upserting vectors:", error)
    throw new Error("Failed to upsert vectors to database")
  }
}

/**
 * Delete vectors from database
 */
export async function deleteVectors(ids: string[]) {
  try {
    console.log(`🗑️  Deleting ${ids.length} vectors...`)
    
    await index.delete(ids)
    
    console.log(`✅ Successfully deleted ${ids.length} vectors`)
    
    return { success: true, count: ids.length }
  } catch (error) {
    console.error("Error deleting vectors:", error)
    throw new Error("Failed to delete vectors from database")
  }
}

/**
 * Get database info
 */
export async function getDatabaseInfo() {
  try {
    const info = await index.info()
    
    return {
      vectorCount: info.vectorCount,
      dimension: info.dimension,
      similarity: info.similarityFunction,
    }
  } catch (error) {
    console.error("Error getting database info:", error)
    throw new Error("Failed to get database information")
  }
}
