# Quick Start Guide

## 🚀 Getting Started in 5 Steps

### Step 1: Install Dependencies (Already Done!)
```bash
npm install
```
✅ All packages installed successfully!

### Step 2: Set Your OpenAI API Key

Open `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Start ChromaDB Server

You need Docker installed. Open a new terminal and run:

```bash
docker run -p 8000:8000 chromadb/chroma
```

**Keep this terminal running!** ChromaDB must be running for the RAG system to work.

### Step 4: Start the Development Server

In your main terminal:

```bash
npm run dev
```

### Step 5: Open Your Browser

Navigate to: **http://localhost:3000**

## 📱 Quick Navigation

Once the app is running:

- **Home** (`/`) - Main dashboard with overview
- **Chat** (`/chat`) - Test the RAG system with queries
- **About** (`/about`) - System architecture details
- **Profile Data** (`/profile-data`) - STAR methodology profile
- **Testing** (`/testing`) - Run 25 automated tests
- **GitHub** (`/github`) - Repository information

## 🎯 Quick Test

1. Go to `/chat`
2. Wait for "Initializing vector database..." message to complete
3. Try asking: "What are Meera's main technical skills?"
4. See the RAG system respond with relevant information!

## ⚠️ Troubleshooting

### ChromaDB Connection Error?
- Make sure Docker is installed and running
- Verify ChromaDB container is running: `docker ps`
- Check port 8000 is not already in use

### OpenAI API Error?
- Verify your API key in `.env.local`
- Ensure you have credits in your OpenAI account
- Check the key format (starts with `sk-`)

### Port 3000 Already in Use?
```bash
npm run dev -- -p 3001
```

## 📊 Testing the System

### Manual Testing
1. Navigate to `/chat`
2. Ask questions like:
   - "What projects has Meera completed?"
   - "Tell me about Meera's RAG system experience"
   - "What are Meera's certifications?"

### Automated Testing
1. Navigate to `/testing`
2. Click "Run All Tests"
3. View results with pass/fail indicators

## 🎓 Week 6 Deliverable Submission

Your submission URL will be:
```
http://localhost:3000
```

For deployment, this will be your Vercel URL after deploying.

## 📝 What This System Does

✅ **RAG System (Step 3)**
- Vector embeddings with OpenAI
- Semantic search with ChromaDB
- Context-aware responses
- Confidence scoring

✅ **STAR Profile (Step 4)**
- Professional experiences structured as STAR
- Optimized for recruiter queries
- Multiple document chunks
- Rich metadata for search

✅ **Required Pages**
- `/about` - Architecture documentation
- `/github` - Repository information  
- `/testing` - 25 sample queries
- `/profile-data` - STAR structured content

## 🚀 Next Steps

1. Customize the profile data in `lib/profile-data.ts`
2. Add your own experiences using STAR methodology
3. Test with various queries
4. Deploy to Vercel for production URL
5. Submit your deployment URL for Week 6 deliverable

---

**Need help?** Check the main README.md for detailed documentation!
