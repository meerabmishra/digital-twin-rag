# RAG Chat Implementation with Vercel AI SDK

## Overview

This implementation uses the **Vercel AI SDK** (v4.x) to create a streaming RAG (Retrieval-Augmented Generation) chat interface. The system combines semantic search with OpenAI's GPT-4o-mini model to provide intelligent responses based on Meera's profile data.

## Architecture

### Components

1. **Frontend (`app/chat/page.tsx`)**
   - Uses `useChat` hook from `ai/react` for streaming chat functionality
   - Provides real-time message streaming with auto-scroll
   - Displays confidence levels and allows stopping generation mid-stream
   - Shows loading states and error handling

2. **Backend API (`app/api/chat/route.ts`)**
   - Uses `streamText` from Vercel AI SDK Core
   - Integrates with RAG context retrieval
   - Streams responses using `toDataStreamResponse()`
   - Automatically works with Vercel AI Gateway when deployed

3. **RAG Layer (`lib/rag-vercel.ts`)**
   - Hugging Face embeddings for semantic search
   - In-memory vector database with cosine similarity
   - Context retrieval with confidence scoring
   - Supports up to 3 relevant documents per query

## Key Features

### ✅ Streaming Chat
- Real-time token-by-token streaming
- Visual loading indicators
- Stop generation capability
- Auto-scroll to latest messages

### ✅ RAG Integration
- Semantic search using embeddings
- Context-aware responses
- Confidence level tracking
- Relevant document retrieval

### ✅ Error Handling
- Graceful error messages
- Retry functionality
- Initialization status tracking
- Network error recovery

### ✅ User Experience
- Sample questions for easy start
- Responsive design (dark mode support)
- Message history persistence
- Typing indicators

## How It Works

### 1. Chat Flow

```
User Input → useChat Hook → POST /api/chat
                ↓
         Retrieve Context (RAG)
                ↓
         Generate Response (OpenAI)
                ↓
         Stream Tokens Back
                ↓
         Display in Real-time
```

### 2. RAG Context Retrieval

```javascript
// User query → Embedding → Similarity Search → Top 3 Documents
const { context, relevantDocs, confidence } = await getRelevantContext(query);
```

### 3. Streaming Response

```javascript
const result = await streamText({
  model: openai('gpt-4o-mini'),
  system: systemMessage + context,  // RAG context injected here
  messages: messages,
  temperature: 0.7,
  maxTokens: 500,
});

return result.toDataStreamResponse();
```

## API Reference

### `useChat` Hook

```typescript
const {
  messages,          // Chat message history
  input,             // Current input value
  handleInputChange, // Input change handler
  handleSubmit,      // Form submit handler
  isLoading,         // Loading state
  error,             // Error state
  stop,              // Stop generation
  reload,            // Retry last message
} = useChat({
  api: '/api/chat',
  onError: (error) => { /* Handle errors */ },
  onFinish: (message) => { /* Message completed */ },
});
```

### `streamText` Function

```typescript
const result = await streamText({
  model: openai('gpt-4o-mini'),
  system: string,              // System prompt
  messages: Message[],         // Chat history
  temperature: number,         // 0-2, creativity
  maxTokens: number,          // Max response length
  onFinish: async (result) => { /* Completion callback */ },
});
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=sk-...your-key-here

# Optional: Hugging Face API Key (for embeddings)
HUGGINGFACE_API_KEY=hf_...your-key-here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Model Configuration

The system uses:
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` (Hugging Face)
- **LLM**: `gpt-4o-mini` (OpenAI via Vercel AI Gateway)
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 500 (concise responses)

## Vercel AI Gateway Integration

When deployed on Vercel, the AI SDK automatically uses the AI Gateway:

### Benefits
- ✅ Unified API for multiple providers
- ✅ Automatic retries and fallbacks
- ✅ $5/day free credits included
- ✅ Usage monitoring and analytics
- ✅ No token markup (0% additional cost)

### Usage

The AI Gateway is **automatically enabled** when:
1. Deployed on Vercel
2. Using `@ai-sdk/openai` or other supported providers
3. No additional configuration needed!

For local development, the SDK connects directly to OpenAI.

## Code Examples

### Sending a Message

```typescript
// Frontend
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!isInitialized || isLoading) return;
  handleChatSubmit(e);
};
```

### Retrieving Context

```typescript
// Backend
const { context, relevantDocs, confidence } = await getRelevantContext(userQuery);

// Returns:
{
  context: "Concatenated relevant documents...",
  relevantDocs: ["doc1", "doc2", "doc3"],
  confidence: "High" | "Medium" | "Low"
}
```

### Rendering Messages

```typescript
{messages.map((message) => (
  <div key={message.id}>
    <p>{message.content}</p>
    {message.annotations && (
      <div>Confidence: {message.annotations[0]?.confidence}</div>
    )}
  </div>
))}
```

## Error Handling

The system handles various error scenarios:

### Initialization Errors
- Vector database not initialized
- Profile data loading failures
- Network connectivity issues

### Runtime Errors
- OpenAI API failures
- Rate limiting (automatic retry)
- Invalid queries

### User Feedback
- Clear error messages
- Retry buttons
- Status indicators

## Performance Optimizations

1. **Auto-scroll**: Smooth scroll to latest message
2. **Debouncing**: Input handling optimization
3. **Streaming**: Token-by-token rendering
4. **Lazy Loading**: On-demand context retrieval
5. **Caching**: In-memory vector storage

## Sample Questions

The UI provides these starter questions:

1. "What are Meera's main technical skills?"
2. "Tell me about Meera's experience with AI and RAG systems"
3. "What projects has Meera completed?"
4. "What certifications does Meera have?"

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard:
# - OPENAI_API_KEY
# - HUGGINGFACE_API_KEY
```

### Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your OpenAI API key
3. Add your Hugging Face API key (optional)
4. Run `npm run dev`

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/chat
# Try sample questions
# Test streaming and stop functionality
```

### Production Testing

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Common Issues

**Issue**: "Vector database not initialized"
- **Solution**: Click "Start Chat" and wait for initialization

**Issue**: Streaming not working
- **Solution**: Check OpenAI API key in `.env.local`

**Issue**: Rate limit errors
- **Solution**: Vercel AI Gateway provides automatic retries

**Issue**: Slow responses
- **Solution**: Check network connection and API status

## Future Enhancements

- [ ] Message persistence with database
- [ ] Multi-user support with sessions
- [ ] File upload for context expansion
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Advanced RAG with re-ranking
- [ ] Tool calling for dynamic data
- [ ] Custom model selection

## Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)
- [AI Gateway Documentation](https://vercel.com/docs/ai-gateway)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Hugging Face Models](https://huggingface.co/models)

## License

This implementation is part of the Digital Twin RAG project and follows the same license.

---

**Last Updated**: November 7, 2025
**Version**: 1.0.0
**Author**: GitHub Copilot (Claude Sonnet 4.5)
