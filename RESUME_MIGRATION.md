# Resume to Vector Database Migration

This guide explains how to migrate your structured JSON resume into vector embeddings and upload them to your Upstash Vector database.

## Overview

The migration system converts your structured JSON resume into semantic chunks optimized for retrieval-augmented generation (RAG). Each section of your resume becomes searchable through AI-powered semantic search.

## What Gets Migrated

Your JSON resume is broken down into the following categories:

### 1. **Personal Overview** (2 docs)
- Summary and professional introduction
- Elevator pitch

### 2. **Contact & Preferences** (2 docs)
- Contact information (email, phone, location)
- Location preferences and work authorization

### 3. **Technical Skills** (10+ docs)
- Programming languages with proficiency levels
- Databases and data tools
- Cloud platforms and DevOps
- AI/ML skills
- Testing frameworks
- Design and prototyping tools
- Collaboration tools

### 4. **Soft Skills** (1 doc)
- Professional qualities and interpersonal skills

### 5. **Work Experience** (multiple docs per job)
For each position:
- Company overview and role description
- Technical skills used in that role
- Leadership examples
- STAR-formatted achievements:
  - Situation
  - Task
  - Action
  - Result
  - Complete STAR story

### 6. **Education** (1 doc per degree)
- Degree, institution, dates, and achievements

### 7. **Projects** (1 doc per project)
- Project description
- Technologies used
- Business impact

### 8. **Career Goals** (1 doc)
- Short-term and long-term objectives
- Learning focus areas
- Industry interests

## Migration Methods

### Method 1: Web Interface (Recommended)

1. Start your development server:
   ```powershell
   npm run dev
   ```

2. Navigate to http://localhost:3000/migrate-resume

3. Click "Start Migration"

4. View the results including document count and category breakdown

### Method 2: API Endpoint

Make a POST request to `/api/migrate-resume`:

```powershell
# Using default path (Downloads folder)
curl -X POST http://localhost:3000/api/migrate-resume

# Or with custom path
curl -X POST http://localhost:3000/api/migrate-resume `
  -H "Content-Type: application/json" `
  -d '{"resumePath": "C:\\path\\to\\your\\resume.json"}'

# Or with inline JSON data
curl -X POST http://localhost:3000/api/migrate-resume `
  -H "Content-Type: application/json" `
  -d '{
    "resume": {
      "personal": {...},
      "experience": [...],
      ...
    }
  }'
```

### Method 3: TypeScript Script

Run the migration script directly:

```powershell
# With default path
npx ts-node scripts/migrate-resume.ts

# With custom path
npx ts-node scripts/migrate-resume.ts "C:\path\to\resume.json"
```

## Expected Output

A successful migration will output:

```
🚀 Starting Resume Migration to Vector Database
📂 Resume path: C:\Users\Meera\Downloads\meera_mishra_resume_structured.json

📄 Reading resume JSON file...
✅ Resume loaded successfully
   Name: Meera Mishra
   Title: Frontend-focused Full-Stack Developer

🔄 Converting resume to vector documents...
✅ Created 85 documents from resume

Document breakdown:
   - overview: 2 documents
   - contact: 1 documents
   - preferences: 1 documents
   - skills: 15 documents
   - experience: 55 documents
   - education: 2 documents
   - projects: 2 documents
   - career_goals: 1 documents

📤 Uploading to Upstash Vector database...
Processed 85/85 documents
Successfully added 85 documents to Upstash Vector

✅ Successfully migrated 85 documents to vector database
🎉 Migration complete!
```

## How Embeddings Work

1. **Automatic Embedding Generation**: Upstash Vector automatically generates embeddings for each document using their built-in embedding model
2. **Semantic Search**: When you ask a question, Upstash converts your query to an embedding and finds the most similar documents
3. **Context Retrieval**: The top 3 most relevant documents are retrieved and sent to the AI model
4. **Answer Generation**: GPT-4o-mini uses the retrieved context to answer your question

## Testing Your Migration

After migration, test your vector database:

1. Go to http://localhost:3000/chat

2. Try these sample questions:
   - "What are Meera's React skills?"
   - "Tell me about her experience at Aisthetic"
   - "What is her elevator pitch?"
   - "What testing tools does she know?"
   - "What are her career goals?"

3. Check the console for confidence scores:
   - **High**: Very relevant results found
   - **Medium**: Somewhat relevant results
   - **Low**: Limited relevant information

## Metadata Structure

Each document includes rich metadata for filtering and tracking:

```typescript
{
  content: "Document text...",
  metadata: {
    category: 'experience',        // Document category
    type: 'star_complete',          // Document type
    company: 'Diginnovators',       // Context info
    achievement: 1,                 // Achievement number
    source: 'resume_json'           // Source identifier
  }
}
```

## Troubleshooting

### Migration Fails

**Error: Upstash credentials missing**
- Check `.env.local` has `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN`
- Get credentials from https://console.upstash.com/

**Error: File not found**
- Verify the resume JSON path is correct
- Use absolute paths in Windows: `C:\\Users\\...`

**Error: JSON parse failed**
- Validate your JSON structure matches the expected schema
- Check for trailing commas or syntax errors

### Low Quality Results

**AI returns generic answers**
- Run migration again to ensure documents uploaded
- Check console logs for embedding creation
- Verify documents in Upstash console

**Wrong context retrieved**
- Improve query specificity
- Add more context to your questions
- Check if relevant sections exist in your resume

## File Structure

```
digital-twin/
├── app/
│   ├── api/
│   │   └── migrate-resume/
│   │       └── route.ts           # API endpoint
│   └── migrate-resume/
│       └── page.tsx                # Web UI
├── scripts/
│   └── migrate-resume.ts           # CLI script
├── lib/
│   └── rag-upstash.ts             # Vector DB functions
└── RESUME_MIGRATION.md             # This file
```

## Resume JSON Schema

Your resume must follow this structure:

```typescript
{
  "personal": {
    "name": "string",
    "title": "string",
    "location": "string",
    "summary": "string",
    "elevator_pitch": "string",
    "contact": { email, phone, linkedin, github, portfolio }
  },
  "salary_location": {
    "location_preferences": ["string"],
    "remote_experience": "string",
    "travel_availability": "string",
    "work_authorization": "string"
  },
  "experience": [
    {
      "company": "string",
      "title": "string",
      "duration": "string",
      "location": "string",
      "company_context": "string",
      "team_structure": "string",
      "achievements_star": [
        {
          "situation": "string",
          "task": "string",
          "action": "string",
          "result": "string"
        }
      ],
      "technical_skills_used": ["string"],
      "leadership_examples": ["string"]
    }
  ],
  "skills": {
    "technical": {
      "programming_languages": [
        {
          "language": "string",
          "years": number,
          "proficiency": "string",
          "frameworks": ["string"]
        }
      ],
      "databases": ["string"],
      "cloud_platforms": ["string"],
      "ai_ml": ["string"],
      "testing_tools": ["string"],
      "design_tooling": ["string"],
      "collaboration": ["string"]
    },
    "soft_skills": ["string"]
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "graduation_year": number | null,
      "status": "string",
      "percentage": "string"
    }
  ],
  "projects_portfolio": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "impact": "string"
    }
  ],
  "career_goals": {
    "short_term": "string",
    "long_term": "string",
    "learning_focus": ["string"],
    "industries_interested": ["string"]
  }
}
```

## Next Steps

After successful migration:

1. ✅ Test the chat interface with various questions
2. ✅ Compare results with the original profile data
3. ✅ Deploy to Vercel with environment variables
4. ✅ Monitor Upstash usage and vector count
5. ✅ Update resume JSON and re-migrate as needed

## Resources

- **Upstash Console**: https://console.upstash.com/
- **Upstash Vector Docs**: https://upstash.com/docs/vector
- **OpenAI Embeddings**: https://platform.openai.com/docs/guides/embeddings
- **Vercel AI SDK**: https://sdk.vercel.ai/docs

---

**Last Updated**: November 2024  
**Author**: Meera Mishra  
**Project**: Digital Twin RAG System
