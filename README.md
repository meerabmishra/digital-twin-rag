# Digital Twin RAG System

## Week 6 Deliverable - Steps 3 & 4 Implementation

A comprehensive Retrieval-Augmented Generation (RAG) system serving as an AI-powered professional digital twin, optimized for recruiter and hiring team interactions.

## 🎯 Project Overview

This project implements **Steps 3 and 4** of the digital-twin-workshop methodology, creating a fully functional RAG system with:

- **Advanced RAG Architecture** with vector embeddings and semantic search
- **STAR Methodology** structured professional profile
- **Real-time Query Processing** for recruiter-style questions
- **Comprehensive Testing Suite** with 25+ sample queries
- **Professional Documentation** and quality assessments

## 🚀 Features

### Core RAG Functionality
- ✅ Vector embeddings using OpenAI `text-embedding-3-small`
- ✅ ChromaDB integration for efficient vector storage
- ✅ Semantic search with configurable result count
- ✅ Context-aware response generation with GPT-4o-mini
- ✅ Confidence scoring based on retrieval quality

### Professional Profile (STAR Methodology)
- ✅ Comprehensive experience documentation using STAR framework
  - **S**ituation: Context and challenges
  - **T**ask: Objectives and goals
  - **A**ction: Specific steps taken
  - **R**esult: Measurable outcomes
- ✅ Skills categorization (Technical & Soft)
- ✅ Education and certifications
- ✅ Key achievements and metrics

### Interactive Features
- ✅ Real-time chat interface for queries
- ✅ 25 pre-built recruiter-style test questions
- ✅ Automated testing suite with quality assessments
- ✅ Comprehensive documentation pages

## 📁 Project Structure

```
digital-twin/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # RAG query endpoint
│   │   └── initialize/route.ts    # Vector DB initialization
│   ├── about/page.tsx              # System architecture docs
│   ├── chat/page.tsx               # Interactive chat interface
│   ├── github/page.tsx             # Repository information
│   ├── profile-data/page.tsx      # STAR methodology profile
│   ├── testing/page.tsx            # Testing suite & queries
│   ├── layout.tsx
│   ├── page.tsx                    # Home page
│   └── globals.css
├── lib/
│   ├── rag.ts                      # RAG system implementation
│   └── profile-data.ts             # STAR structured content
├── .env.local                      # Environment configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🛠️ Technology Stack

- **Framework:** Next.js 15 with App Router
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Vector Database:** ChromaDB
- **AI/ML:** OpenAI API (Embeddings + Completions)
- **Icons:** Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- Docker (for ChromaDB)
- OpenAI API Key

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd digital-twin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start ChromaDB Server

```bash
docker run -p 8000:8000 chromadb/chroma
```

Keep this running in a separate terminal.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

### Home Page (`/`)
- Overview of the Digital Twin RAG system
- Quick navigation to all features
- System features and capabilities

### Chat Interface (`/chat`)
- Interactive query interface
- Real-time RAG responses
- Confidence scoring
- Sample questions for testing

### About Page (`/about`)
- System architecture documentation
- Technology stack details
- Implementation of Steps 3-4
- Key features explanation

### Profile Data (`/profile-data`)
- Complete professional profile
- STAR methodology experiences
- Skills and achievements
- Content organization strategy

### Testing Suite (`/testing`)
- 25 recruiter-style test queries
- Automated testing functionality
- Quality assessment metrics
- Pass rate calculation

### GitHub Page (`/github`)
- Repository information
- Project structure
- Setup instructions
- Key implementation files

## 🧪 Testing

The system includes 25 comprehensive test queries covering:

- **Skills & Expertise** (5 queries)
- **Experience** (6 queries)
- **STAR Methodology** (4 queries)
- **Authentication & Security** (2 queries)
- **MCP Development** (1 query)
- **Deployment** (2 queries)
- **Tools & Workflow** (2 queries)
- **Complex Queries** (3 queries)

### Running Tests

1. Navigate to `/testing`
2. Click "Run All Tests"
3. View results with pass/fail indicators
4. Review confidence scores and responses

### Test Criteria

- Tests pass if ≥60% of expected keywords appear in responses
- Confidence scores based on retrieval quality
- Difficulty levels: Easy, Medium, Hard

## 📊 Key Implementation Details

### Vector Database Population

Professional profile is chunked into semantic documents:
- **Overview** - General introduction
- **Skills** - Technical and soft skills
- **Education** - Academic background
- **STAR Experiences** - Detailed project breakdowns
- **Achievements** - Key accomplishments
- **Certifications** - Professional credentials

### RAG Pipeline

1. **Query Processing** - User question received
2. **Embedding Generation** - Convert query to vector
3. **Semantic Search** - Find relevant documents in ChromaDB
4. **Context Building** - Combine retrieved documents
5. **Response Generation** - GPT-4o-mini creates natural answer
6. **Quality Scoring** - Calculate confidence based on relevance

### STAR Methodology Implementation

Each professional experience includes:

```typescript
{
  situation: "Challenge/context description",
  task: "Objectives and goals",
  action: ["Step 1", "Step 2", "Step 3", ...],
  result: "Measurable outcomes and impact",
  category: "Project type",
  keywords: ["keyword1", "keyword2", ...]
}
```

## 🎓 Learning Outcomes

This project demonstrates:

- ✅ Advanced RAG system architecture
- ✅ Vector database integration
- ✅ OpenAI API usage (embeddings + completions)
- ✅ Professional content structuring
- ✅ Full-stack Next.js development
- ✅ TypeScript best practices
- ✅ Testing and quality assurance
- ✅ Professional documentation

## 📦 Deployment

### Vercel Deployment

```bash
npm run build
vercel deploy
```

### Environment Variables

Ensure these are set in your deployment platform:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

### ChromaDB in Production

For production deployment, consider:
- Hosted ChromaDB instance
- Docker container on cloud platform
- Alternative vector databases (Pinecone, Weaviate)

## 🔧 Customization

### Update Profile Data

Edit `lib/profile-data.ts` to customize:
- Professional information
- STAR experiences
- Skills and achievements
- Education and certifications

### Modify RAG Parameters

Edit `lib/rag.ts` to adjust:
- Number of retrieved documents
- Embedding model
- Response generation model
- Confidence thresholds

## 📝 Week 6 Deliverable Requirements

### ✅ Required Components

- [x] Fully functional RAG system (Step 3)
- [x] Professional profile using STAR methodology (Step 4)
- [x] Interactive query interface
- [x] `/about` page - System architecture
- [x] `/github` page - Repository information
- [x] `/testing` page - 20+ sample queries
- [x] `/profile-data` page - Structured content
- [x] Vector embeddings and semantic search
- [x] Real-time response generation
- [x] Quality assessment and confidence scoring

### ✅ Acceptance Criteria

- [x] RAG system responds accurately to professional queries
- [x] Professional profile demonstrates STAR methodology
- [x] Vector embeddings and search quality optimized
- [x] GitHub repository shows complete implementation
- [x] System demonstrates recruiter-ready interactions

## 🤝 Support

For questions or issues:
1. Check documentation pages within the application
2. Review code comments in implementation files
3. Test with sample queries in `/testing`

## 📄 License

This project is part of the AI Agent Developer Workshop Series.

## 🎉 Acknowledgments

- AI Agents Workshop Series
- OpenAI API
- ChromaDB
- Next.js & React teams
- Vercel platform

---

**Built with ❤️ as part of the Week 6 deliverable for the AI Agent Developer program**
