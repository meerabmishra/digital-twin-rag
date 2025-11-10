import { Index } from "@upstash/vector"
import { readFileSync } from 'fs'

// Read .env.local
const envContent = readFileSync('.env.local', 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.+)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
  }
})

const index = new Index({
  url: envVars.UPSTASH_VECTOR_REST_URL,
  token: envVars.UPSTASH_VECTOR_REST_TOKEN,
})

async function testContentExtraction() {
  console.log('🧪 Testing Content Extraction Fix...\n')
  
  // Test search
  console.log('🔍 Searching for: "technical skills React Next.js"')
  const results = await index.query({
    data: "technical skills React Next.js TypeScript",
    topK: 3,
    includeMetadata: true,
  })
  
  console.log(`\n✅ Found ${results.length} results\n`)
  
  results.forEach((r, i) => {
    console.log(`📄 Result ${i + 1}:`)
    console.log(`   Score: ${r.score.toFixed(3)}`)
    
    // Extract using the NEW logic
    const title = r.metadata?.title || r.metadata?.category || r.metadata?.type || 'Professional Content'
    const content = r.metadata?.content || r.metadata?.text || ''
    
    console.log(`   Title: ${title}`)
    console.log(`   Content: ${content.substring(0, 150)}...`)
    console.log(`   Has content field: ${!!r.metadata?.content}`)
    console.log(`   Has text field: ${!!r.metadata?.text}`)
    console.log('')
  })
  
  console.log('✅ Content extraction test complete!')
  console.log('\n💡 The AI should now be able to read your JSON resume data correctly!')
}

testContentExtraction().then(() => {
  process.exit(0)
}).catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
