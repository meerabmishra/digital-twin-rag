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

async function testVectorDatabase() {
  console.log('🧪 Testing Vector Database...\n')
  
  // 1. Check database info
  console.log('📊 Database Info:')
  try {
    const info = await index.info()
    console.log(`   Vectors: ${info.vectorCount}`)
    console.log(`   Dimension: ${info.dimension}`)
    console.log(`   Similarity: ${info.similarityFunction}\n`)
  } catch (error) {
    console.error('   ❌ Error:', error)
    return
  }
  
  // 2. Test search for skills
  console.log('🔍 Test Search 1: Technical Skills')
  try {
    const results1 = await index.query({
      data: "technical skills programming languages frameworks",
      topK: 5,
      includeMetadata: true,
    })
    console.log(`   Found: ${results1.length} results`)
    results1.forEach((r, i) => {
      console.log(`   ${i + 1}. Score: ${r.score.toFixed(3)} | ${r.metadata?.title || 'No title'}`)
      if (r.metadata?.text) {
        console.log(`      Text: ${r.metadata.text.substring(0, 100)}...`)
      }
    })
    console.log('')
  } catch (error) {
    console.error('   ❌ Error:', error)
  }
  
  // 3. Test search for experience
  console.log('🔍 Test Search 2: Work Experience')
  try {
    const results2 = await index.query({
      data: "work experience job positions companies",
      topK: 5,
      includeMetadata: true,
    })
    console.log(`   Found: ${results2.length} results`)
    results2.forEach((r, i) => {
      console.log(`   ${i + 1}. Score: ${r.score.toFixed(3)} | ${r.metadata?.title || 'No title'}`)
      if (r.metadata?.text) {
        console.log(`      Text: ${r.metadata.text.substring(0, 100)}...`)
      }
    })
    console.log('')
  } catch (error) {
    console.error('   ❌ Error:', error)
  }
  
  // 4. Test search for projects
  console.log('🔍 Test Search 3: Projects')
  try {
    const results3 = await index.query({
      data: "projects portfolio applications built",
      topK: 5,
      includeMetadata: true,
    })
    console.log(`   Found: ${results3.length} results`)
    results3.forEach((r, i) => {
      console.log(`   ${i + 1}. Score: ${r.score.toFixed(3)} | ${r.metadata?.title || 'No title'}`)
      if (r.metadata?.text) {
        console.log(`      Text: ${r.metadata.text.substring(0, 100)}...`)
      }
    })
    console.log('')
  } catch (error) {
    console.error('   ❌ Error:', error)
  }
  
  // 5. Sample a few random vectors to see metadata structure
  console.log('📝 Sample Vector Metadata:')
  try {
    const sampleResults = await index.query({
      data: "Meera Mishra professional",
      topK: 3,
      includeMetadata: true,
    })
    
    sampleResults.forEach((r, i) => {
      console.log(`\n   Sample ${i + 1}:`)
      console.log(`   ID: ${r.id}`)
      console.log(`   Score: ${r.score.toFixed(3)}`)
      console.log(`   Metadata Keys:`, Object.keys(r.metadata || {}))
      if (r.metadata) {
        console.log(`   Full Metadata:`, JSON.stringify(r.metadata, null, 2).substring(0, 300))
      }
    })
  } catch (error) {
    console.error('   ❌ Error:', error)
  }
}

testVectorDatabase().then(() => {
  console.log('\n✅ Test complete!')
  process.exit(0)
}).catch(error => {
  console.error('\n❌ Test failed:', error)
  process.exit(1)
})
