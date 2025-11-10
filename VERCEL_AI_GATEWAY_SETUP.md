# Vercel AI Gateway Setup Guide

## What is Vercel AI Gateway?

Vercel AI Gateway provides:
- **$5/day in free credits** for AI requests
- **Single API key** to access multiple AI providers (OpenAI, Anthropic, Google, etc.)
- **Automatic retries** and fallbacks for high reliability
- **No markup** on token costs (0% additional fees)
- **Usage monitoring** and spend tracking
- **BYOK support** (Bring Your Own Key) to use your own provider credits

## Quick Setup

### Step 1: Create AI Gateway API Key

1. Visit https://vercel.com/dashboard
2. Click **AI Gateway** tab
3. Click **API Keys** → **Create Key**
4. Copy your key (starts with `vi_...`)
5. Add to `.env.local`:
   ```bash
   AI_GATEWAY_API_KEY=vi_your_actual_key_here
   ```

### Step 2: Get Upstash Vector Database

1. Visit https://console.upstash.com/
2. Sign up/login (free tier: 10K vectors!)
3. Click **Vector** → **Create Index**
4. Configure:
   - Name: `digital-twin-rag`
   - Region: Choose closest
   - Dimensions: `1536`
   - Distance: `COSINE`
5. Click **Create**
6. Copy **REST URL** and **REST TOKEN**
7. Add to `.env.local`:
   ```bash
   UPSTASH_VECTOR_REST_URL=https://your-endpoint.upstash.io
   UPSTASH_VECTOR_REST_TOKEN=your_token_here
   ```

### Step 3: Start Development

```bash
npm run dev
```

Visit http://localhost:3000/chat and start chatting!

## Optional: Add Your Own OpenAI Key (BYOK)

To use your own OpenAI credits instead of Gateway's free tier:

1. Get OpenAI key from https://platform.openai.com/api-keys
2. In Vercel Dashboard > AI Gateway > **Integrations**
3. Click **OpenAI** → **Add**
4. Paste your OpenAI key → **Enable** → **Test Key**

Now requests will use your OpenAI credits (with 0% markup) and fall back to Gateway credits if they fail.

## How It Works

The AI SDK automatically routes through AI Gateway when `AI_GATEWAY_API_KEY` is set:

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// No special configuration needed!
// Uses AI Gateway automatically
const result = await streamText({
  model: openai('gpt-4o-mini'),
  // ...
});
```

### Request Flow

**With AI Gateway Only:**
```
Your App → AI Gateway (vi_xxx) → OpenAI (Gateway Credits)
```

**With BYOK:**
```
Your App → AI Gateway (vi_xxx) → Your OpenAI (sk_xxx) → Fallback to Gateway
```

## Monitoring & Budget

### View Usage

1. Vercel Dashboard > AI Gateway > **Usage**
2. See:
   - Total requests & tokens
   - Cost breakdown by model
   - Success/error rates
   - Provider distribution

### Set Budget Alerts

1. Click **Budget** in Usage section
2. Set daily/monthly limits
3. Get email alerts

## Pricing

- **Free**: $5/day in credits
- **After free tier**: Pay only token costs (0% markup)
- **Example** (gpt-4o-mini):
  - Input: $0.15 per 1M tokens
  - Output: $0.60 per 1M tokens
  - Same as direct OpenAI!

## Troubleshooting

### "Vector database not initialized"

**Solution**: AI Gateway key is set, but initialization might take 20-30 seconds. Wait and refresh.

### "AI Gateway API key is required"

**Solution**:
1. Check `.env.local` has `AI_GATEWAY_API_KEY=vi_...`
2. Restart: `npm run dev`

### "Upstash Vector credentials are required"

**Solution**:
1. Check `.env.local` has both `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN`
2. Create index at https://console.upstash.com/
3. Restart: `npm run dev`

### "Rate limit exceeded"

**Solution**:
1. Free tier resets daily (midnight UTC)
2. Add BYOK OpenAI key for higher limits
3. Upgrade Vercel plan

## Environment Variables Summary

Required in `.env.local`:

```bash
# Vercel AI Gateway (required)
AI_GATEWAY_API_KEY=vi_your_key_here

# Upstash Vector Database (required)
UPSTASH_VECTOR_REST_URL=https://your-endpoint.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Benefits vs Direct Provider Access

| Feature | Direct OpenAI | With AI Gateway |
|---------|--------------|-----------------|
| API Key Management | One per provider | Single key for all |
| Free Credits | No | $5/day |
| Automatic Retries | No | Yes |
| Fallbacks | No | Yes |
| Usage Monitoring | Basic | Advanced |
| Token Markup | 0% | 0% |
| Provider Switching | Code changes | Easy |

## Resources

- **AI Gateway Docs**: https://vercel.com/docs/ai-gateway
- **AI SDK Docs**: https://sdk.vercel.ai/
- **Get API Key**: https://vercel.com/dashboard
- **Community**: https://github.com/vercel/ai/discussions

---

**Next**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete application setup instructions.
