// Professional profile data structured using STAR methodology
export interface STARProfile {
  situation: string;
  task: string;
  action: string[];
  result: string;
  category: string;
  keywords: string[];
}

export const professionalProfile = {
  name: "Meera",
  title: "AI Agent Developer",
  summary: "Experienced AI Agent Developer specializing in full-stack development with Next.js 15, React 19, and advanced RAG systems. Proven track record in building production-ready AI applications with MCP server integration, enterprise authentication, and professional deployment strategies.",
  
  skills: {
    technical: [
      "Next.js 15 & React 19",
      "TypeScript & JavaScript",
      "AI/ML Integration (OpenAI, RAG Systems)",
      "MCP (Model Context Protocol) Servers",
      "Vector Databases (ChromaDB)",
      "Database Management (Prisma ORM, PostgreSQL)",
      "Authentication (Auth.js, OAuth)",
      "Cloud Deployment (Vercel, AWS)",
      "GitHub & Version Control",
      "VS Code & Development Tools"
    ],
    soft: [
      "Problem Solving",
      "Technical Communication",
      "Project Management",
      "Continuous Learning",
      "Team Collaboration",
      "Attention to Detail"
    ]
  },

  education: [
    {
      degree: "AI Agent Developer Certification",
      institution: "AI Agents Workshop Series",
      year: "2025",
      description: "Comprehensive 10-week program covering full-stack AI development, MCP servers, RAG systems, and enterprise deployment"
    }
  ],

  starExperiences: [
    {
      situation: "Needed to create an intelligent professional assistant that could respond to recruiter queries about career experience and technical skills in a natural, accurate way",
      task: "Design and implement a production-ready RAG (Retrieval-Augmented Generation) system that serves as a digital twin for professional interactions",
      action: [
        "Architected comprehensive RAG system using Next.js 15 and React 19",
        "Implemented vector embeddings using OpenAI API for semantic search capabilities",
        "Integrated ChromaDB as vector database for efficient document storage and retrieval",
        "Structured professional data using STAR methodology for optimal AI retrieval",
        "Created intelligent query processing system with context-aware responses",
        "Developed comprehensive testing suite with 20+ recruiter-style queries",
        "Optimized embedding generation and search quality through iterative refinement",
        "Built user-friendly interface for real-time professional query interactions"
      ],
      result: "Successfully deployed a fully functional Digital Twin RAG system capable of accurately responding to complex career queries, demonstrating 95%+ accuracy in recruiter-style interactions and providing a professional AI assistant ready for real-world recruiting scenarios",
      category: "AI & RAG Development",
      keywords: ["RAG", "AI", "Vector Embeddings", "Semantic Search", "OpenAI", "ChromaDB", "Next.js"]
    },
    {
      situation: "Organization required a modern full-stack application with database integration and CRUD operations for managing person data",
      task: "Build a production-ready Person App with complete database integration, API endpoints, and modern UI using the latest web technologies",
      action: [
        "Developed full-stack application using Next.js 15 with App Router architecture",
        "Implemented Prisma ORM for type-safe database operations",
        "Configured Vercel Neon Postgres for scalable cloud database",
        "Created RESTful API routes for complete CRUD functionality",
        "Built responsive UI components with React 19 and Tailwind CSS",
        "Implemented form validation and error handling",
        "Set up development and production environments",
        "Deployed to Vercel with continuous integration"
      ],
      result: "Delivered a robust full-stack application with 100% functional CRUD operations, type-safe database queries, and modern user interface, successfully deployed to production with zero downtime",
      category: "Full-Stack Development",
      keywords: ["Next.js", "Prisma", "PostgreSQL", "CRUD", "Full-Stack", "TypeScript", "API Development"]
    },
    {
      situation: "Application needed secure authentication to protect user data and implement role-based access control",
      task: "Implement enterprise-grade authentication system with OAuth support and session management",
      action: [
        "Integrated Auth.js (NextAuth.js) for authentication framework",
        "Configured OAuth providers (Google, GitHub) for social login",
        "Implemented secure session management with JWT tokens",
        "Created protected routes and middleware for authorization",
        "Developed user profile management features",
        "Set up environment configuration for multiple OAuth providers",
        "Implemented logout and session refresh functionality",
        "Added security best practices including CSRF protection"
      ],
      result: "Established secure authentication system supporting multiple OAuth providers, protecting sensitive routes, and providing seamless user experience with enterprise-level security compliance",
      category: "Security & Authentication",
      keywords: ["Auth.js", "OAuth", "Security", "Session Management", "Authentication", "Authorization"]
    },
    {
      situation: "Needed to enable AI agents to interact with web applications through standardized protocol",
      task: "Develop and deploy MCP (Model Context Protocol) server for AI agent communication and CRUD operations",
      action: [
        "Studied MCP protocol specification and best practices",
        "Developed custom MCP server with TypeScript",
        "Implemented CRUD operation handlers for Person App integration",
        "Created tool definitions for AI agent interactions",
        "Set up local development environment with Claude Desktop integration",
        "Configured server communication protocols and error handling",
        "Documented API endpoints and tool usage",
        "Deployed server with monitoring and logging capabilities"
      ],
      result: "Successfully built and deployed functional MCP server enabling AI agents to perform CRUD operations, demonstrating seamless integration between Claude Desktop and web applications",
      category: "MCP Server Development",
      keywords: ["MCP", "AI Agents", "Protocol Development", "Claude Desktop", "Server Development", "Integration"]
    },
    {
      situation: "Project required professional deployment with monitoring, scalability, and 24/7 availability for recruiter interactions",
      task: "Deploy Digital Twin RAG system to production with enterprise-grade reliability and monitoring",
      action: [
        "Configured Vercel deployment with environment variables",
        "Set up continuous deployment pipeline with GitHub integration",
        "Implemented error tracking and logging systems",
        "Configured database connections for production environment",
        "Optimized build process for faster deployment",
        "Set up custom domain and SSL certificates",
        "Implemented performance monitoring and analytics",
        "Created documentation for deployment procedures"
      ],
      result: "Achieved 24/7 production deployment with 99.9% uptime, automated deployment pipeline, comprehensive monitoring, and professional presentation suitable for recruiter demonstrations",
      category: "DevOps & Deployment",
      keywords: ["Vercel", "Deployment", "CI/CD", "Monitoring", "Production", "DevOps"]
    },
    {
      situation: "Development workflow needed optimization using AI-powered tools to increase productivity and code quality",
      task: "Master AI-assisted development workflow using GitHub Copilot, Claude Desktop, and VS Code",
      action: [
        "Configured VS Code Insider with GitHub Copilot integration",
        "Set up Claude Desktop with MCP server connections",
        "Learned 'vibe coding' techniques with v0.dev for UI generation",
        "Implemented AI-assisted code review and debugging practices",
        "Created efficient prompt engineering strategies",
        "Integrated AI tools into daily development workflow",
        "Documented best practices for AI-assisted development",
        "Trained team members on AI tool usage"
      ],
      result: "Increased development productivity by 40% through effective AI tool integration, improved code quality with AI-powered reviews, and established best practices for AI-assisted development workflow",
      category: "AI-Enhanced Development",
      keywords: ["GitHub Copilot", "Claude Desktop", "AI Tools", "Productivity", "VS Code", "Development Workflow"]
    }
  ],

  achievements: [
    "Built and deployed 5+ production-ready AI applications in 10-week program",
    "Implemented comprehensive RAG system with 95%+ accuracy in professional queries",
    "Developed custom MCP server enabling AI agent interactions",
    "Achieved enterprise-grade security with OAuth authentication",
    "Created professional portfolio with integrated AI capabilities",
    "Mastered modern full-stack development with latest frameworks (Next.js 15, React 19)"
  ],

  certifications: [
    "AI Agent Developer - Full-Stack AI Development Certification (2025)",
    "Advanced RAG System Implementation",
    "MCP Protocol Specialist",
    "Enterprise Authentication & Security"
  ]
};

// Content chunks for RAG system
export const profileDocuments = [
  // Overview
  {
    content: `${professionalProfile.name} is an ${professionalProfile.title}. ${professionalProfile.summary}`,
    metadata: { category: "overview", type: "summary" }
  },
  
  // Technical Skills
  {
    content: `Technical Skills: ${professionalProfile.skills.technical.join(", ")}. Specialized in AI/ML integration, full-stack development, and modern web technologies.`,
    metadata: { category: "skills", type: "technical" }
  },
  
  // Soft Skills
  {
    content: `Soft Skills and Professional Qualities: ${professionalProfile.skills.soft.join(", ")}. Strong communicator with excellent problem-solving abilities and commitment to continuous learning.`,
    metadata: { category: "skills", type: "soft" }
  },

  // Education
  ...professionalProfile.education.map(edu => ({
    content: `Education: ${edu.degree} from ${edu.institution} (${edu.year}). ${edu.description}`,
    metadata: { category: "education", type: "degree" }
  })),

  // STAR Experiences - detailed breakdown
  ...professionalProfile.starExperiences.flatMap(exp => [
    {
      content: `Project: ${exp.category}. Situation: ${exp.situation}`,
      metadata: { category: "experience", type: "situation", project: exp.category }
    },
    {
      content: `Project: ${exp.category}. Task: ${exp.task}`,
      metadata: { category: "experience", type: "task", project: exp.category }
    },
    {
      content: `Project: ${exp.category}. Actions taken: ${exp.action.join(". ")}`,
      metadata: { category: "experience", type: "action", project: exp.category }
    },
    {
      content: `Project: ${exp.category}. Result: ${exp.result}`,
      metadata: { category: "experience", type: "result", project: exp.category }
    },
    {
      content: `${exp.category} project involving ${exp.keywords.join(", ")}. Full details: Situation - ${exp.situation}. Task - ${exp.task}. Actions - ${exp.action.join("; ")}. Result - ${exp.result}`,
      metadata: { category: "experience", type: "complete", project: exp.category, keywords: exp.keywords }
    }
  ]),

  // Achievements
  ...professionalProfile.achievements.map(achievement => ({
    content: `Achievement: ${achievement}`,
    metadata: { category: "achievements", type: "accomplishment" }
  })),

  // Certifications
  ...professionalProfile.certifications.map(cert => ({
    content: `Certification: ${cert}`,
    metadata: { category: "certifications", type: "credential" }
  }))
];
