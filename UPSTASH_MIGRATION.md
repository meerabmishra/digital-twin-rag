# Migration to Upstash Vector

## What Changed?

**Replaced**: Hugging Face embeddings → **Upstash Vector**

### Why Upstash Vector?

✅ **Automatic Embeddings** - No separate embedding API needed  
✅ **Faster** - Managed service with global edge network  
✅ **More Reliable** - Enterprise-grade infrastructure  
✅ **Generous Free Tier** - 10,000 vectors, 10,000 queries/day  
✅ **Simpler Setup** - One service instead of two  
✅ **Better Performance** - Optimized for semantic search

## Quick Setup

### 1. Install Upstash SDK

```bash
npm install @upstash/vector
```

### 2. Create Upstash Vector Index

1. Go to https://console.upstash.com/
2. Sign up (free tier available!)
3. Click **Vector** → **Create Index**
4. Settings:
   - **Name**: `digital-twin-rag`
   - **Region**: Choose closest to you
   - **Dimensions**: `1536` (OpenAI embeddings)
   - **Distance Metric**: `COSINE`
5. Click **Create**

### 3. Get Credentials

After creating the index:
1. Click on your index
2. Copy **REST URL**
3. Copy **REST TOKEN**

### 4. Update .env.local

```bash
# Remove these (no longer needed):
# HUGGINGFACE_API_KEY=hf_...

# Add these:
UPSTASH_VECTOR_REST_URL=https://your-endpoint.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here

# Keep these:
AI_GATEWAY_API_KEY=vi_your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Restart Development Server

```bash
npm run dev
```

## What's Different?

### Before (Hugging Face)
- ❌ Separate embedding API calls
- ❌ Manual similarity calculations
- ❌ In-memory vector storage
- ❌ Rate limits on embedding generation
- ❌ Sequential document processing

### After (Upstash Vector)
- ✅ Automatic embedding generation
- ✅ Built-in similarity search
- ✅ Persistent cloud storage
- ✅ Higher rate limits
- ✅ Batch processing (100 at a time)

## Code Changes

### New Implementation (`lib/rag-upstash.ts`)

```typescript
import { Index } from '@upstash/vector';

// Initialize once
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Upstash handles embeddings automatically!
await index.upsert([{
  id: 'doc1',
  data: 'Your document text here',
  metadata: { category: 'profile' }
}]);

// Query with automatic embedding
const results = await index.query({
  data: 'user query',
  topK: 3,
  includeMetadata: true,
});
```

### API Routes Updated
- ✅ `app/api/chat/route.ts` - Uses `rag-upstash`
- ✅ `app/api/initialize/route.ts` - Checks Upstash credentials

## Features

### Automatic Embeddings
Upstash generates embeddings for you - no separate API needed!

### Batch Processing
Documents are uploaded in batches of 100 for faster initialization.

### Persistent Storage
Vectors persist across deployments - initialize once!

### Global Edge Network
Fast queries from anywhere in the world.

## Free Tier Limits

- **10,000 vectors** (way more than needed for a profile!)
- **10,000 queries/day** (perfect for development)
- **Global regions** (choose closest to you)
- **Automatic backups** (data safety included)

## Monitoring

### View Usage
1. Go to https://console.upstash.com/
2. Click your Vector index
3. See:
   - Total vectors stored
   - Queries per day
   - Storage used
   - Response times

### Index Info
The initialization logs show:
```
Upstash Vector index info: { vectorCount: 30, ... }
```

## Troubleshooting

### "UPSTASH_VECTOR_REST_URL is required"

**Solution**: Add both URL and TOKEN to `.env.local`

### "Failed to add documents"

**Solution**: Check credentials are correct and index exists

### Initialization seems slow

**Normal**: First upload takes 10-20 seconds for ~30 documents

### Vectors not persisting

**Check**: Are you using the same index across restarts?

## Comparison

| Feature | Hugging Face | Upstash Vector |
|---------|--------------|----------------|
| Embedding API | Separate | Built-in |
| Storage | In-memory | Persistent Cloud |
| Rate Limits | Strict | Generous |
| Setup Complexity | Medium | Easy |
| Free Tier | Yes | Yes (10K vectors) |
| Speed | Slower | Faster |
| Reliability | Good | Excellent |

## Production Ready

Upstash Vector is production-ready:
- ✅ 99.9% uptime SLA
- ✅ Automatic scaling
- ✅ Enterprise security
- ✅ Global CDN
- ✅ Monitoring & alerts

## Next Steps

1. ✅ Create Upstash Vector index
2. ✅ Update `.env.local` with credentials
3. ✅ Restart dev server
4. ✅ Test chat at http://localhost:3000/chat
5. ✅ Deploy to Vercel (credentials in env vars)

---

**Questions?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions!
