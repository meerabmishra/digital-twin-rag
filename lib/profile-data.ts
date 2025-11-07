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
  name: "Meera Mishra",
  title: "Frontend-Focused Full-Stack Developer",
  location: "Manor Lakes, Melbourne, VIC 3024",
  email: "meerabmishra102@gmail.com",
  phone: "0414 159 070",
  linkedin: "https://www.linkedin.com/in/meera-mishra",
  
  summary: "Frontend-focused Full-Stack Developer with 3+ years of experience in designing and building responsive, scalable, and user-friendly web applications. Skilled in React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind, Material UI, and SQL. Adept at creating modern, reusable UI components, optimizing performance, and collaborating in Agile teams. Experienced in designing wireframes and prototypes in Figma and building seamless UI/UX from concept to deployment.",
  
  skills: {
    technical: [
      "JavaScript (ES6+)",
      "TypeScript",
      "HTML5",
      "CSS3",
      "React.js",
      "Next.js",
      "Redux",
      "Tailwind CSS",
      "Material UI",
      "Figma (Wireframing, Prototyping)",
      "SQL Server",
      "MySQL",
      "Power BI",
      "RESTful APIs",
      "Jest",
      "Cypress",
      "React Testing Library",
      "Git & GitHub",
      "Visual Studio Code",
      "Postman"
    ],
    soft: [
      "Problem Solving",
      "Team Collaboration",
      "Agile Development",
      "UI/UX Design",
      "Technical Communication",
      "Code Review",
      "Performance Optimization",
      "Attention to Detail"
    ]
  },

  education: [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "Jain University, Bangalore, India",
      year: "2017-2021",
      description: "Graduated with 89.03% - Strong foundation in computer science fundamentals, web development, and software engineering"
    }
  ],

  starExperiences: [
    {
      situation: "Tassie Solar needed streamlined operations management and data visualization for solar project delivery teams",
      task: "Manage scheduling, documentation, communication, and create performance dashboards for project tracking",
      action: [
        "Managed scheduling and documentation for project delivery teams",
        "Used Microsoft Excel and Word for reporting and operational tracking",
        "Facilitated virtual meetings using Microsoft Teams and Zoom",
        "Created Power BI dashboards to track and visualize operational performance",
        "Coordinated team activities and managed project timelines",
        "Improved communication workflows between teams",
        "Maintained documentation standards across projects"
      ],
      result: "Improved operational efficiency through data visualization and streamlined processes, gaining valuable experience in team coordination and project management transferable to Agile software development environments",
      category: "Operations & Project Management",
      keywords: ["Project Management", "Power BI", "Data Visualization", "Team Coordination", "Microsoft Office", "Operations"]
    },
    {
      situation: "Diginnovators needed scalable web applications with modern UI components and seamless user experience",
      task: "Build and maintain dynamic web applications using modern frameworks with focus on responsive design and performance",
      action: [
        "Built dynamic web applications using React.js, Next.js, and JavaScript",
        "Designed reusable UI components with Tailwind CSS and Material UI for scalability",
        "Created wireframes and prototypes in Figma",
        "Translated Figma designs into responsive front-end solutions",
        "Integrated RESTful APIs for data-driven features",
        "Optimized front-end performance for seamless user experience",
        "Worked with SQL databases for reporting features",
        "Collaborated in Agile sprints, resolving production issues"
      ],
      result: "Successfully delivered multiple scalable web applications with optimized performance, modern UI components, and seamless API integrations, contributing to improved user satisfaction and application reliability",
      category: "Full-Stack Web Development",
      keywords: ["React.js", "Next.js", "JavaScript", "Tailwind CSS", "Material UI", "Figma", "SQL", "REST APIs", "Agile"]
    },
    {
      situation: "Aisthetic needed to launch Buzzplosion, the first-ever South Indian celebrity website, requiring robust frontend and e-commerce features",
      task: "Develop and launch celebrity platform with e-commerce functionality, responsive UI, and state management",
      action: [
        "Developed Buzzplosion platform using React.js and Tailwind CSS",
        "Built e-commerce features with responsive UI design",
        "Integrated secure API connections for payment and user management",
        "Implemented Redux for state management to improve maintainability",
        "Optimized application performance and load times",
        "Collaborated with designers using Figma for pixel-perfect implementation",
        "Conducted testing and bug fixes before launch",
        "Delivered user-friendly interface with modern design patterns"
      ],
      result: "Successfully launched Buzzplosion as the first South Indian celebrity website, achieving smooth e-commerce functionality, excellent user experience, and positive user feedback on UI/UX design",
      category: "Frontend Development & E-commerce",
      keywords: ["React.js", "Tailwind CSS", "Redux", "E-commerce", "Figma", "State Management", "Responsive Design"]
    },
    {
      situation: "Smartstream Technologies required responsive web applications with interactive interfaces and database integration",
      task: "Design and develop responsive web applications translating UI/UX designs into functional interfaces with API and database integration",
      action: [
        "Designed responsive web applications using React.js, JavaScript, HTML5, CSS3",
        "Translated Figma UI/UX designs into interactive front-end interfaces",
        "Integrated REST APIs for complete application functionality",
        "Connected SQL Server databases for data management",
        "Conducted thorough code reviews for quality assurance",
        "Performed debugging and optimization for performance improvements",
        "Collaborated with backend team for seamless integration",
        "Implemented component-driven architecture for reusability"
      ],
      result: "Delivered high-quality responsive web applications with optimized performance, seamless API integrations, and maintainable codebase, receiving recognition for code quality and attention to detail",
      category: "Frontend & Solution Development",
      keywords: ["React.js", "JavaScript", "HTML5", "CSS3", "Figma", "REST APIs", "SQL Server", "Code Review"]
    }
  ],

  achievements: [
    "Led operations for solar project teams with data visualization using Power BI",
    "Built and launched Buzzplosion - first South Indian celebrity website",
    "Delivered multiple scalable web applications using React.js and Next.js",
    "Created reusable UI component libraries with Tailwind CSS and Material UI",
    "Translated 50+ Figma designs into responsive front-end interfaces",
    "Optimized application performance resulting in improved load times",
    "Collaborated successfully in Agile teams across multiple projects"
  ],

  certifications: [
    "Bachelor of Technology in Computer Science (89.03%)"
  ],

  interests: [
    "Exploring new technology",
    "Literature",
    "Environmental Conservation",
    "Art",
    "Yoga",
    "Skiing",
    "Travel"
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
