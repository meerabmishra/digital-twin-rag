import 'server-only';
import { readFileSync } from 'fs';
import { join } from 'path';
import { addDocuments } from '../lib/rag-upstash';

interface ResumeJSON {
  personal: {
    name: string;
    title: string;
    location: string;
    summary: string;
    elevator_pitch: string;
    contact: {
      email: string;
      phone: string;
      linkedin: string;
      github: string;
      portfolio: string;
    };
  };
  salary_location: {
    location_preferences: string[];
    remote_experience: string;
    travel_availability: string;
    work_authorization: string;
  };
  experience: Array<{
    company: string;
    title: string;
    duration: string;
    location: string;
    company_context: string;
    team_structure: string;
    achievements_star: Array<{
      situation: string;
      task: string;
      action: string;
      result: string;
    }>;
    technical_skills_used: string[];
    leadership_examples: string[];
  }>;
  skills: {
    technical: {
      programming_languages: Array<{
        language: string;
        years: number;
        proficiency: string;
        frameworks: string[];
      }>;
      databases: string[];
      cloud_platforms: string[];
      ai_ml: string[];
      testing_tools: string[];
      design_tooling: string[];
      collaboration: string[];
    };
    soft_skills: string[];
  };
  education: Array<{
    institution: string;
    degree: string;
    graduation_year: number | null;
    status?: string;
    percentage?: string;
  }>;
  projects_portfolio: Array<{
    name: string;
    description: string;
    technologies: string[];
    impact: string;
  }>;
  career_goals: {
    short_term: string;
    long_term: string;
    learning_focus: string[];
    industries_interested: string[];
  };
}

// Convert JSON resume to vector database documents
function convertResumeToDocuments(resume: ResumeJSON) {
  const documents: Array<{ content: string; metadata: any }> = [];

  // Personal Overview
  documents.push({
    content: `${resume.personal.name} is a ${resume.personal.title}. ${resume.personal.summary}`,
    metadata: { category: 'overview', type: 'summary', source: 'resume_json' }
  });

  documents.push({
    content: `Elevator Pitch: ${resume.personal.elevator_pitch}`,
    metadata: { category: 'overview', type: 'elevator_pitch', source: 'resume_json' }
  });

  // Contact Information
  documents.push({
    content: `Contact: Email: ${resume.personal.contact.email}, Phone: ${resume.personal.contact.phone}, Location: ${resume.personal.location}`,
    metadata: { category: 'contact', type: 'info', source: 'resume_json' }
  });

  // Location & Work Preferences
  documents.push({
    content: `Location Preferences: ${resume.salary_location.location_preferences.join(', ')}. ${resume.salary_location.remote_experience}. ${resume.salary_location.travel_availability}. Work Authorization: ${resume.salary_location.work_authorization}`,
    metadata: { category: 'preferences', type: 'location_work', source: 'resume_json' }
  });

  // Technical Skills - Programming Languages
  resume.skills.technical.programming_languages.forEach(lang => {
    documents.push({
      content: `Technical Expertise: ${lang.language} (${lang.proficiency}, ${lang.years}+ years) with frameworks/tools: ${lang.frameworks.join(', ')}`,
      metadata: { 
        category: 'skills', 
        type: 'technical', 
        skill: lang.language,
        proficiency: lang.proficiency,
        source: 'resume_json' 
      }
    });
  });

  // Technical Skills - Other Categories
  documents.push({
    content: `Databases: ${resume.skills.technical.databases.join(', ')}`,
    metadata: { category: 'skills', type: 'databases', source: 'resume_json' }
  });

  documents.push({
    content: `Cloud & DevOps: ${resume.skills.technical.cloud_platforms.join(', ')}`,
    metadata: { category: 'skills', type: 'cloud', source: 'resume_json' }
  });

  documents.push({
    content: `AI/ML Skills: ${resume.skills.technical.ai_ml.join(', ')}`,
    metadata: { category: 'skills', type: 'ai_ml', source: 'resume_json' }
  });

  documents.push({
    content: `Testing Tools: ${resume.skills.technical.testing_tools.join(', ')}`,
    metadata: { category: 'skills', type: 'testing', source: 'resume_json' }
  });

  documents.push({
    content: `Design & Prototyping: ${resume.skills.technical.design_tooling.join(', ')}`,
    metadata: { category: 'skills', type: 'design', source: 'resume_json' }
  });

  documents.push({
    content: `Collaboration Tools: ${resume.skills.technical.collaboration.join(', ')}`,
    metadata: { category: 'skills', type: 'collaboration', source: 'resume_json' }
  });

  // Soft Skills
  documents.push({
    content: `Soft Skills and Professional Qualities: ${resume.skills.soft_skills.join(', ')}`,
    metadata: { category: 'skills', type: 'soft', source: 'resume_json' }
  });

  // Experience - STAR Format
  resume.experience.forEach((exp, index) => {
    // Company Overview
    documents.push({
      content: `Experience at ${exp.company} as ${exp.title} (${exp.duration}, ${exp.location}). ${exp.company_context}. Team Structure: ${exp.team_structure}`,
      metadata: { 
        category: 'experience', 
        type: 'overview',
        company: exp.company,
        position: index + 1,
        source: 'resume_json'
      }
    });

    // Technical Skills Used at Company
    documents.push({
      content: `At ${exp.company}, worked with: ${exp.technical_skills_used.join(', ')}`,
      metadata: { 
        category: 'experience', 
        type: 'technical_skills',
        company: exp.company,
        source: 'resume_json'
      }
    });

    // Leadership Examples
    if (exp.leadership_examples.length > 0) {
      documents.push({
        content: `Leadership at ${exp.company}: ${exp.leadership_examples.join('; ')}`,
        metadata: { 
          category: 'experience', 
          type: 'leadership',
          company: exp.company,
          source: 'resume_json'
        }
      });
    }

    // STAR Achievements
    exp.achievements_star.forEach((star, starIndex) => {
      // Individual STAR components
      documents.push({
        content: `${exp.company} - Achievement ${starIndex + 1}: Situation: ${star.situation}`,
        metadata: { 
          category: 'experience', 
          type: 'star_situation',
          company: exp.company,
          achievement: starIndex + 1,
          source: 'resume_json'
        }
      });

      documents.push({
        content: `${exp.company} - Achievement ${starIndex + 1}: Task: ${star.task}`,
        metadata: { 
          category: 'experience', 
          type: 'star_task',
          company: exp.company,
          achievement: starIndex + 1,
          source: 'resume_json'
        }
      });

      documents.push({
        content: `${exp.company} - Achievement ${starIndex + 1}: Action: ${star.action}`,
        metadata: { 
          category: 'experience', 
          type: 'star_action',
          company: exp.company,
          achievement: starIndex + 1,
          source: 'resume_json'
        }
      });

      documents.push({
        content: `${exp.company} - Achievement ${starIndex + 1}: Result: ${star.result}`,
        metadata: { 
          category: 'experience', 
          type: 'star_result',
          company: exp.company,
          achievement: starIndex + 1,
          source: 'resume_json'
        }
      });

      // Complete STAR story
      documents.push({
        content: `${exp.company} Achievement: Situation - ${star.situation}. Task - ${star.task}. Action - ${star.action}. Result - ${star.result}`,
        metadata: { 
          category: 'experience', 
          type: 'star_complete',
          company: exp.company,
          achievement: starIndex + 1,
          source: 'resume_json'
        }
      });
    });
  });

  // Education
  resume.education.forEach(edu => {
    const eduContent = edu.graduation_year 
      ? `Education: ${edu.degree} from ${edu.institution} (${edu.graduation_year})${edu.percentage ? `, ${edu.percentage}` : ''}`
      : `Education: ${edu.degree} from ${edu.institution} (${edu.status || 'In progress'})`;
    
    documents.push({
      content: eduContent,
      metadata: { 
        category: 'education', 
        type: 'degree',
        institution: edu.institution,
        source: 'resume_json'
      }
    });
  });

  // Projects
  resume.projects_portfolio.forEach(project => {
    documents.push({
      content: `Project: ${project.name}. ${project.description}. Technologies: ${project.technologies.join(', ')}. Impact: ${project.impact}`,
      metadata: { 
        category: 'projects', 
        type: 'portfolio',
        project_name: project.name,
        technologies: project.technologies,
        source: 'resume_json'
      }
    });
  });

  // Career Goals
  documents.push({
    content: `Career Goals - Short-term: ${resume.career_goals.short_term}. Long-term: ${resume.career_goals.long_term}. Currently learning: ${resume.career_goals.learning_focus.join(', ')}. Interested in industries: ${resume.career_goals.industries_interested.join(', ')}`,
    metadata: { 
      category: 'career_goals', 
      type: 'goals',
      source: 'resume_json'
    }
  });

  return documents;
}

// Main migration function
export async function migrateResumeToVectorDB(resumePath: string) {
  try {
    console.log('📄 Reading resume JSON file...');
    const resumeData = readFileSync(resumePath, 'utf-8');
    const resume: ResumeJSON = JSON.parse(resumeData);

    console.log('✅ Resume loaded successfully');
    console.log(`   Name: ${resume.personal.name}`);
    console.log(`   Title: ${resume.personal.title}`);

    console.log('\n🔄 Converting resume to vector documents...');
    const documents = convertResumeToDocuments(resume);
    
    console.log(`✅ Created ${documents.length} documents from resume`);
    console.log('\nDocument breakdown:');
    const categoryCounts: Record<string, number> = {};
    documents.forEach(doc => {
      const cat = doc.metadata.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} documents`);
    });

    console.log('\n📤 Uploading to Upstash Vector database...');
    const ids = await addDocuments(documents);
    
    console.log(`\n✅ Successfully migrated ${ids.length} documents to vector database`);
    console.log('🎉 Migration complete!');

    return {
      success: true,
      documentCount: documents.length,
      documentIds: ids,
      categories: categoryCounts
    };
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  const resumePath = process.argv[2] || join(process.cwd(), 'data', 'resume.json');
  
  console.log('🚀 Starting Resume Migration to Vector Database');
  console.log(`📂 Resume path: ${resumePath}\n`);
  
  migrateResumeToVectorDB(resumePath)
    .then((result) => {
      console.log('\n📊 Migration Summary:');
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed with error:');
      console.error(error);
      process.exit(1);
    });
}
