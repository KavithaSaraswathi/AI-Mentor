import { StorageService } from './storageService';
import { DailyProgressEntry, DailyProgressAnalysis, ResumeAnalysisRecord } from '../types';

export interface DailyRecommendation {
  primaryTitle: string;
  category: 'Java + DSA' | 'AI / ML' | 'Placement' | 'Revision';
  reason: string;
  actionText: string;
  targetPath: string;
  secondarySuggestions: string[];
}

export const AiService = {
  /**
   * Core Recommendation Engine for "What Should I Do Today?"
   */
  getTodayRecommendation(): DailyRecommendation {
    const javaTopics = StorageService.getJavaTopics();
    const dsaTopics = StorageService.getDsaTopics();
    const aimlTopics = StorageService.getAiMlTopics();
    const aptitudeTopics = StorageService.getAptitudeTopics();
    const problems = StorageService.getProblems();

    const secondarySuggestions: string[] = [];

    // Rule 1: Needs Revision check
    const weakJava = javaTopics.find(t => t.status === 'Needs Revision');
    const weakDsa = dsaTopics.find(t => t.status === 'Needs Revision');
    const weakAiml = aimlTopics.find(t => t.status === 'Needs Revision');
    const revisionProblem = problems.find(p => p.status === 'Needs Revision' || p.needsRevision);

    if (weakDsa || revisionProblem) {
      const topicName = weakDsa ? weakDsa.name : (revisionProblem?.topic || 'DSA Patterns');
      secondarySuggestions.push('Practice 1 LeetCode problem on ' + topicName);
      secondarySuggestions.push('Revise ' + (weakJava?.name || 'Java Collections API'));

      return {
        primaryTitle: `Revise DSA Weak Area: ${topicName}`,
        category: 'Java + DSA',
        reason: `You marked ${topicName} as needing revision. Reviewing weak patterns prevents concept decay!`,
        actionText: 'Solve Problem / Revise Topic',
        targetPath: 'java-dsa',
        secondarySuggestions
      };
    }

    // Rule 2: Aptitude Accuracy Check (<75%)
    const lowAptitude = aptitudeTopics.find(a => a.accuracy > 0 && a.accuracy < 75);
    if (lowAptitude) {
      secondarySuggestions.push(`Solve 10 questions on ${lowAptitude.name}`);
      secondarySuggestions.push('Review formula notes for ' + lowAptitude.weakSubtopics.join(', '));

      return {
        primaryTitle: `Boost Aptitude Accuracy: ${lowAptitude.name}`,
        category: 'Placement',
        reason: `Your accuracy in ${lowAptitude.name} is currently ${lowAptitude.accuracy}%. Increasing this will boost your screening performance.`,
        actionText: 'Practice Aptitude',
        targetPath: 'placement',
        secondarySuggestions
      };
    }

    // Rule 3: Active In-Progress AI/ML Topic
    const learningAiml = aimlTopics.find(t => t.status === 'Learning');
    if (learningAiml) {
      secondarySuggestions.push(`Complete next module in ${learningAiml.name}`);
      secondarySuggestions.push('Build a mini script to test concepts learned');

      return {
        primaryTitle: `Continue AI/ML: ${learningAiml.name}`,
        category: 'AI / ML',
        reason: `You are currently ${learningAiml.progress}% through ${learningAiml.name}. Completing this module builds your foundation for Generative AI.`,
        actionText: 'Continue AI/ML Topic',
        targetPath: 'aiml',
        secondarySuggestions
      };
    }

    // Rule 4: Active In-Progress Java Topic
    const learningJava = javaTopics.find(t => t.status === 'Learning');
    if (learningJava) {
      secondarySuggestions.push(`Complete ${learningJava.name} notes`);
      secondarySuggestions.push('Solve 1 related coding problem');

      return {
        primaryTitle: `Master Java: ${learningJava.name}`,
        category: 'Java + DSA',
        reason: `You are actively learning ${learningJava.name}. Solidifying Java fundamentals essential for tech interviews.`,
        actionText: 'Study Java Topic',
        targetPath: 'java-dsa',
        secondarySuggestions
      };
    }

    // Default Fallback
    return {
      primaryTitle: 'Solve 1 Medium DSA Problem & 15m Aptitude',
      category: 'Java + DSA',
      reason: 'Regular consistency in coding and aptitude keeps you interview-ready every single week.',
      actionText: 'Open DSA Tracker',
      targetPath: 'java-dsa',
      secondarySuggestions: [
        'Explore Pandas / NumPy exercises',
        'Review CS Fundamentals notes (DBMS / OS)'
      ]
    };
  },

  /**
   * Daily Learning Progress Analysis
   */
  analyzeDailyProgress(entry: Partial<DailyProgressEntry>): DailyProgressAnalysis {
    const duration = entry.durationMinutes || 0;
    const probs = entry.problemsSolved || 0;
    const cat = entry.category || 'General';

    let strength = 'You maintained great study focus today!';
    let weakness = 'Ensure you space out your topics and take short revision breaks.';
    let suggestedNextStep = 'Review tomorrow morning with a 5-minute quick flashcard check.';

    if (probs >= 2) {
      strength = `Excellent problem-solving output (${probs} problems solved). You are building real DSA muscle memory.`;
    } else if (duration >= 90) {
      strength = `Strong deep-work capacity (${Math.floor(duration / 60)}h ${duration % 60}m logged). Consistency is key!`;
    }

    if (cat.includes('AI') || cat.includes('ML')) {
      weakness = 'Don\'t forget to pair theoretical AI concepts with small executable Python scripts.';
      suggestedNextStep = 'Next session: Apply what you learned by creating a notebook script or GitHub project update.';
    } else if (cat.includes('Java') || cat.includes('DSA')) {
      weakness = 'Watch out for dry-running edge cases (empty input, single element, negative values).';
      suggestedNextStep = 'Next session: Attempt 1 new problem on the same pattern without looking at solutions.';
    } else if (cat.includes('Aptitude')) {
      weakness = 'Focus on shortcut formulas to reduce average time per question under 1.5 minutes.';
      suggestedNextStep = 'Next session: Practice timed 10-question set.';
    }

    return {
      totalDurationMinutes: duration,
      categoryBreakdown: { [cat]: duration },
      problemsSolvedToday: probs,
      strength,
      weakness,
      suggestedNextStep
    };
  },

  /**
   * Evaluate Technology/Framework: Should it be in Roadmap or Explore Later?
   */
  evaluateTechnology(techName: string, description: string): { destination: 'roadmap' | 'explore_later'; reason: string } {
    const aimlTopics = StorageService.getAiMlTopics();
    const currentAiml = aimlTopics.find(t => t.status === 'Learning');

    const coreRoadmapKeywords = ['python', 'numpy', 'pandas', 'matplotlib', 'scikit', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'transformers', 'rag', 'vector db', 'prompt engineering'];
    const lower = (techName + ' ' + description).toLowerCase();

    const isCore = coreRoadmapKeywords.some(kw => lower.includes(kw));

    if (isCore) {
      return {
        destination: 'roadmap',
        reason: `"${techName}" aligns directly with your core AI/ML roadmap curriculum. You should schedule it after completing ${currentAiml ? currentAiml.name : 'Python Foundation'}.`
      };
    } else {
      return {
        destination: 'explore_later',
        reason: `"${techName}" is an interesting advanced/trending tool, but jumping into it right now risks context switching away from your current focus (${currentAiml ? currentAiml.name : 'Foundations'}). Put it in Explore Later to stay focused!`
      };
    }
  },

  /**
   * Resume Analyzer Engine
   */
  analyzeResume(resumeContent: string, targetRole: string): ResumeAnalysisRecord {
    const text = resumeContent.toLowerCase();

    // Key role requirements
    const roleKeywords: Record<string, string[]> = {
      'Java Developer': ['java', 'spring', 'oop', 'dsa', 'collections', 'multithreading', 'sql', 'dbms', 'git', 'rest api', 'junit', 'maven'],
      'Software Developer': ['java', 'python', 'dsa', 'algorithms', 'oop', 'sql', 'dbms', 'git', 'rest api', 'system design', 'data structures'],
      'Data Analyst': ['python', 'pandas', 'numpy', 'sql', 'tableau', 'excel', 'statistics', 'matplotlib', 'data visualization', 'cleaning'],
      'Machine Learning Intern': ['python', 'pandas', 'numpy', 'scikit-learn', 'machine learning', 'statistics', 'linear regression', 'jupyter', 'git', 'model evaluation'],
      'AI/ML Engineer': ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'deep learning', 'transformers', 'cnn', 'rnn', 'model deployment', 'mlops', 'git', 'statistics'],
      'GenAI Engineer': ['python', 'llm', 'prompt engineering', 'rag', 'vector database', 'embeddings', 'langchain', 'openai', 'transformers', 'fastapi', 'git']
    };

    const targetKeywords = roleKeywords[targetRole] || roleKeywords['Machine Learning Intern'];

    const matched = targetKeywords.filter(kw => text.includes(kw));
    const missing = targetKeywords.filter(kw => !text.includes(kw));

    // Calculate score
    const keywordScore = Math.round((matched.length / targetKeywords.length) * 60);

    // Structural checks
    const hasProjects = text.includes('project') || text.includes('projects');
    const hasEducation = text.includes('education') || text.includes('b.tech') || text.includes('college') || text.includes('university');
    const hasSkills = text.includes('skills') || text.includes('technical skills');
    const hasQuantifiable = /\d+%|\d+x|\d+ users|\d+ms|\d+ accuracy/i.test(resumeContent);

    let structureScore = 0;
    if (hasProjects) structureScore += 10;
    if (hasEducation) structureScore += 10;
    if (hasSkills) structureScore += 10;
    if (hasQuantifiable) structureScore += 10;

    const totalScore = Math.min(98, Math.max(45, keywordScore + structureScore));

    const strengths: string[] = [];
    if (matched.length > 0) strengths.push(`Found key technical skills: ${matched.slice(0, 5).join(', ')}`);
    if (hasProjects) strengths.push('Included relevant technical projects section');
    if (hasQuantifiable) strengths.push('Contains quantifiable achievements & metrics');
    if (hasEducation) strengths.push('Clear educational background listed');

    const weaknesses: string[] = [];
    if (!hasQuantifiable) weaknesses.push('Lacks quantifiable metrics (e.g. "Improved speed by 35%", "Achieved 92% accuracy")');
    if (missing.length > 0) weaknesses.push(`Missing important target role keywords: ${missing.slice(0, 4).join(', ')}`);
    if (resumeContent.length < 300) weaknesses.push('Resume length is too short; expand project descriptions');

    const suggestions: string[] = [];
    suggestions.push(`Add missing keywords relevant to ${targetRole}: ${missing.slice(0, 5).join(', ')}.`);
    suggestions.push('Use strong action verbs at the start of bullet points (e.g., Developed, Optimized, Architected, Trained, Deployed).');
    suggestions.push('Add metrics to project descriptions (e.g., "Trained model achieving 94% F1-score on 10k dataset").');
    suggestions.push('Ensure simple single-column formatting for optimal parsing in Applicant Tracking Systems.');

    return {
      id: 'res_ana_' + Date.now(),
      resumeName: resumeContent.substring(0, 25).trim() || 'Uploaded_Resume.pdf',
      targetRole,
      score: totalScore,
      strengths,
      weaknesses,
      missingSkills: missing,
      suggestions,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * AI Mentor Personalized Chat Assistant Response Generator
   */
  async generateMentorResponse(userPrompt: string): Promise<string> {
    const profile = StorageService.getProfile();
    const javaTopics = StorageService.getJavaTopics();
    const dsaTopics = StorageService.getDsaTopics();
    const aimlTopics = StorageService.getAiMlTopics();
    const aptitudeTopics = StorageService.getAptitudeTopics();
    const exploreLater = StorageService.getExploreLater();
    const problems = StorageService.getProblems();

    const lowerPrompt = userPrompt.toLowerCase();

    // Check optional OpenAI API Key override
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('ai_mentor_openai_key');
    if (apiKey && apiKey.startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are AI Mentor, a personalized learning & placement companion for ${profile.name}.
Target Role: ${profile.currentRoleTarget}. Learning Style: ${profile.learningStyle}.
Keep answers practical, encouraging, clear, structured, and focused. Avoid hype.`
              },
              { role: 'user', content: userPrompt }
            ]
          })
        });
        const data = await response.json();
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to rule-based mentor engine:', err);
      }
    }

    // Rule-based Personalized Mentor Responses
    if (lowerPrompt.includes('what should i study') || lowerPrompt.includes('what should i learn today')) {
      const rec = this.getTodayRecommendation();
      return `👋 Hi **${profile.name}**! Here is your personalized recommendation for today:

🎯 **Focus Area:** ${rec.primaryTitle} (${rec.category})
💡 **Why this matters:** ${rec.reason}

**Suggested Plan for Today:**
1. ${rec.primaryTitle}
2. ${rec.secondarySuggestions[0] || 'Revise key concepts'}
3. ${rec.secondarySuggestions[1] || 'Practice 10 mins aptitude'}

Stay consistent with your ${profile.streakDays}-day learning streak! 🔥`;
    }

    if (lowerPrompt.includes('1 hour') || lowerPrompt.includes('one hour') || lowerPrompt.includes('short study')) {
      return `⏱️ **1-Hour Express Power Session Plan:**

- ⏱️ **00 - 30m (DSA / Coding):** Pick 1 Medium problem on Arrays / Sliding Window (e.g. *Container With Most Water* or *Longest Substring*).
- ⏱️ **30 - 50m (Core Learning):** Study 1 active topic in ${profile.currentRoleTarget} roadmap (e.g., Pandas groupby / Java Collections).
- ⏱️ **50 - 60m (Aptitude / Quick Test):** Practice 5 questions on Time & Work or Percentages.

Keep it tight and focused! 🚀`;
    }

    if (lowerPrompt.includes('weak') || lowerPrompt.includes('struggle')) {
      const weakJava = javaTopics.filter(t => t.status === 'Needs Revision').map(t => t.name);
      const weakDsa = dsaTopics.filter(t => t.status === 'Needs Revision').map(t => t.name);
      const weakApt = aptitudeTopics.filter(a => a.accuracy > 0 && a.accuracy < 75).map(a => `${a.name} (${a.accuracy}% accuracy)`);

      return `📊 **Your Current Identified Weak Areas:**

- ☕ **Java:** ${weakJava.length > 0 ? weakJava.join(', ') : 'None marked (Great job!)'}
- 🧩 **DSA:** ${weakDsa.length > 0 ? weakDsa.join(', ') : 'Sliding window & Dynamic Programming'}
- 🎯 **Aptitude:** ${weakApt.length > 0 ? weakApt.join(', ') : 'Probability & Time/Work'}

💡 **Recommendation:** Spend your next dedicated study block revising one weak topic rather than introducing a new framework.`;
    }

    if (lowerPrompt.includes('langgraph') || lowerPrompt.includes('crewai') || lowerPrompt.includes('mcp') || lowerPrompt.includes('new framework') || lowerPrompt.includes('should i learn')) {
      return `🤖 **Technology Relevance Evaluation:**

Rule: *"Does this help your current AI/ML roadmap or improve your active project right now?"*

Currently, your focus is on **${aimlTopics.find(t => t.status === 'Learning')?.name || 'Python Foundation'}**.

Unless you have completed NumPy, Pandas, Supervised ML, and basic LLM APIs, jumping straight to advanced agent frameworks like LangGraph/CrewAI will cause unnecessary cognitive overload.

📌 **Recommendation:** Add this technology to your **Explore Later** list for now, and stay focused on mastering your core foundation!`;
    }

    if (lowerPrompt.includes('java interview') || lowerPrompt.includes('java prep')) {
      return `☕ **Top Java Placement Interview Topics to Master:**

1. **HashMap Internal Working:** How hash collisions are handled (LinkedList -> Red-Black Tree in Java 8+).
2. **String Constant Pool & Immutability:** Why String is immutable and how StringBuilder differs.
3. **OOP 4 Pillars:** Abstract Class vs Interface (Default & Static methods).
4. **Exception Hierarchy:** Checked (IOException) vs Unchecked (RuntimeException).
5. **Multithreading Basics:** Runnable vs Thread, synchronized keyword, ExecutorService.

Would you like me to quiz you on any of these topics?`;
    }

    if (lowerPrompt.includes('explain') || lowerPrompt.includes('concept') || lowerPrompt.includes('what is')) {
      return `💡 **Learning Breakdown Framework:**

1. **What is it?** A fundamental concept designed to solve specific efficiency or design challenges.
2. **Why does it matter?** It reduces time complexity or improves maintainability.
3. **How does it work?** Step-by-step breakdown using standard data structures.
4. **Practical Example:** Used in real-world software applications and technical interviews.
5. **Next Step:** Try implementing a small code example in your local environment.`;
    }

    // Default friendly response
    return `👋 I am your **AI Mentor**! 

I track your progress across **Java + DSA**, **AI / ML**, **Placement Prep**, and **Resume Analysis**.

Here are quick actions you can ask me:
- *"What should I study today?"*
- *"I have one hour. Give me a study plan."*
- *"Which topics are weak for me?"*
- *"Should I learn a new AI framework now?"*
- *"Help me prepare for a Java technical interview."*

What would you like to work on right now?`;
  }
};
