# Setup Guide - RAG Chat with Vercel AI SDK

## Quick Start

Follow these steps to get your RAG chat application running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

### 3. Get Your API Keys

#### Vercel AI Gateway API Key (Required)
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click the **AI Gateway** tab
3. Click **API Keys** in the sidebar
4. Click **Create Key**
5. Copy the key (starts with `vi_`)
6. Add to `.env.local`:
   ```
   AI_GATEWAY_API_KEY=vi_your-actual-key-here
   ```

#### Upstash Vector Database (Required)
1. Visit [Upstash Console](https://console.upstash.com/)
2. Sign up or log in (free tier available!)
3. Click **Vector** → **Create Index**
4. Choose:
   - **Name**: digital-twin-rag
   - **Region**: Choose closest to you
   - **Dimensions**: 1536 (for OpenAI embeddings)
   - **Distance Metric**: COSINE
5. Click **Create**
6. Copy **REST URL** and **REST TOKEN**
7. Add to `.env.local`:
   ```
   UPSTASH_VECTOR_REST_URL=https://your-endpoint.upstash.io
   UPSTASH_VECTOR_REST_TOKEN=your_token_here
   ```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open the Chat Interface

Navigate to [http://localhost:3000/chat](http://localhost:3000/chat)

## Troubleshooting

### Error: "Vector database not initialized"

**Cause**: The system couldn't initialize the vector database with embeddings.

**Solutions**:
1. Ensure both API keys are set in `.env.local`
2. Check that keys are valid (not placeholder values)
3. Restart the development server after adding keys
4. Check the terminal for initialization logs

### Error: "Vercel AI Gateway API key is required"

**Cause**: Missing or invalid AI Gateway API key.

**Solution**:
1. Get a valid API key from [Vercel Dashboard > AI Gateway > API Keys](https://vercel.com/dashboard)
2. Add it to `.env.local`: `AI_GATEWAY_API_KEY=vi_...`
3. Restart the development server

### Error: "Upstash Vector credentials are required"

**Cause**: Missing or invalid Upstash Vector credentials.

**Solution**:
1. Create a free Upstash Vector index at [Upstash Console](https://console.upstash.com/)
2. Copy REST URL and REST TOKEN
3. Add both to `.env.local`
4. Restart the development server

### Slow Initialization

**Cause**: Uploading embeddings to Upstash Vector takes time.

**Expected**: Initial setup may take 10-20 seconds for the first time.

**What's happening**:
- System is uploading ~30+ profile documents to Upstash
- Upstash automatically generates embeddings
- Documents are batched in groups of 100
- This is a one-time setup per database

### Chat Not Streaming

**Cause**: Network issues or API configuration problems.

**Solutions**:
1. Check your internet connection
2. Verify API keys are correct
3. Check browser console for errors (F12)
4. Try refreshing the page

### Rate Limit Errors

**Cause**: Too many requests to the API.

**Solutions**:
1. Wait a few seconds between messages
2. OpenAI free tier has rate limits
3. Consider upgrading your OpenAI plan for production use

## Development Tips

### Checking Logs

The terminal shows helpful logs:
- `🚀 Starting vector database initialization...` - Initialization started
- `✅ Vector database initialized successfully` - Setup complete
- `Processed 10/30 documents` - Progress updates

### Testing the Chat

Try these sample questions:
1. "What are Meera's main technical skills?"
2. "Tell me about Meera's experience with React"
3. "What projects has Meera worked on?"
4. "What is Meera's education background?"

### Performance Notes

- **First message**: Slower due to initial API connection
- **Subsequent messages**: Fast streaming responses
- **Stop button**: Can interrupt long responses
- **Auto-scroll**: Messages scroll automatically

## API Key Costs

### Vercel AI Gateway
- **Free Tier**: $5/day in credits (perfect for development!)
- **Cost**: 0% markup over provider costs
- **Usage**: Automatic routing to multiple providers
- **Monitoring**: Full usage dashboard at [Vercel Dashboard](https://vercel.com/dashboard)

### Upstash Vector
- **Free Tier**: 10,000 vectors, 10,000 queries/day
- **Cost**: Free for most development use cases
- **Usage**: Handles embeddings automatically (no separate embedding API!)
- **Monitoring**: Dashboard at [Upstash Console](https://console.upstash.com/)

### Optional: Bring Your Own OpenAI Key (BYOK)
If you want to use your own OpenAI credits:
1. Get key from https://platform.openai.com/api-keys
2. Add to Vercel Dashboard > AI Gateway > Integrations > OpenAI
3. Requests will use your credits with 0% markup
4. Falls back to Gateway credits if yours fail

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # Streaming chat endpoint
│   │   └── initialize/route.ts # Vector DB setup
│   └── chat/page.tsx           # Chat UI
├── lib/
│   ├── rag-upstash.ts          # RAG with Upstash Vector
│   └── profile-data.ts         # Meera's profile
└── .env.local                  # Your API keys (create this)
```

## Next Steps

1. ✅ Set up environment variables
2. ✅ Start the development server
3. ✅ Test the chat interface
4. 📖 Read [RAG_CHAT_IMPLEMENTATION.md](./RAG_CHAT_IMPLEMENTATION.md) for details
5. 🚀 Deploy to Vercel (see [VERCEL_AI_GATEWAY_SETUP.md](./VERCEL_AI_GATEWAY_SETUP.md))

## Getting Help

- **Vercel AI SDK Docs**: https://sdk.vercel.ai/
- **OpenAI Documentation**: https://platform.openai.com/docs
- **Hugging Face Docs**: https://huggingface.co/docs
- **GitHub Issues**: Report bugs in the repository

## Common Questions

**Q: Do I need to pay for these services?**
A: No! Vercel AI Gateway ($5/day free) and Upstash Vector (10K vectors free) cover development needs.

**Q: Why Upstash Vector instead of Hugging Face?**
A: Upstash handles embeddings automatically, is faster, more reliable, and has a generous free tier.

**Q: Can I use different AI models?**
A: Yes! Edit `app/api/chat/route.ts`. Try `anthropic('claude-3-5-sonnet')` or `google('gemini-pro')`.

**Q: How do I deploy this?**
A: See [VERCEL_AI_GATEWAY_SETUP.md](./VERCEL_AI_GATEWAY_SETUP.md) for deployment instructions.

**Q: Is my data secure?**
A: Yes! API keys in `.env.local` are not committed to Git. Both Vercel and Upstash follow enterprise security standards.

**Q: Can I customize the profile data?**
A: Yes! Edit `lib/profile-data.ts` to add your own information.

---

**Need more help?** Check the [troubleshooting guide](./TROUBLESHOOTING.md) or the detailed [implementation docs](./RAG_CHAT_IMPLEMENTATION.md).
