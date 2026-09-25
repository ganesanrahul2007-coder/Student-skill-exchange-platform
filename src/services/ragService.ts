import { DocumentChunk, RetrievedContext, RAGResponse, ChatMessage } from '../types/rag';
import { MOCK_RAG_CHUNKS } from '../data/mockKnowledge';
import { UserProfile } from '../types/user';

/**
 * Text Pre-Processing and Tokenization
 */
function preprocessQuery(query: string): string[] {
  const stopWords = new Set([
    'a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'how', 'i', 'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the',
    'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'can', 'do'
  ]);

  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

/**
 * Calculates vector similarity / relevance score between query tokens and a document chunk.
 */
function calculateRelevanceScore(tokens: string[], chunk: DocumentChunk): number {
  if (tokens.length === 0) return 0.1;

  let matches = 0;
  const chunkText = `${chunk.title} ${chunk.content} ${(chunk.keywords || []).join(' ')}`.toLowerCase();

  for (const token of tokens) {
    if (chunk.keywords?.some((k) => k.toLowerCase().includes(token) || token.includes(k.toLowerCase()))) {
      matches += 3.0; // High keyword weight
    } else if (chunk.title.toLowerCase().includes(token)) {
      matches += 2.0; // Title match
    } else if (chunkText.includes(token)) {
      matches += 1.0; // Body match
    }
  }

  const normalized = Math.min(matches / (tokens.length * 2.5), 0.98);
  return Number(Math.max(normalized, 0.15).toFixed(3));
}

export const ragService = {
  /**
   * Retrieves relevant context chunks from the knowledge base using vector/semantic search
   */
  retrieveContext(query: string, topK: number = 3): RetrievedContext[] {
    const tokens = preprocessQuery(query);

    const scoredChunks = MOCK_RAG_CHUNKS.map((chunk) => {
      const similarityScore = calculateRelevanceScore(tokens, chunk);
      let relevanceExplanation = 'Curriculum & concept alignment';
      if (similarityScore > 0.6) {
        relevanceExplanation = 'Strong skill roadmap & prerequisite match';
      } else if (similarityScore > 0.35) {
        relevanceExplanation = 'Moderate topical relevance';
      }

      return {
        chunk,
        similarityScore,
        relevanceExplanation,
      };
    });

    scoredChunks.sort((a, b) => b.similarityScore - a.similarityScore);
    return scoredChunks.slice(0, topK);
  },

  /**
   * Executes the full RAG pipeline, incorporating student profile, skill levels,
   * learning goals, and gaps when studentContext is provided.
   */
  async askQuestion(query: string, studentContext?: UserProfile | null): Promise<RAGResponse> {
    const retrievedContexts = this.retrieveContext(query, 3);
    const topChunk = retrievedContexts[0];

    // Artificial latency simulating vector search & context generation
    await new Promise((resolve) => setTimeout(resolve, 550));

    const q = query.toLowerCase();
    let answer = '';

    const studentSkillWanted = studentContext?.skills_wanted?.[0] || 'your wishlist skill';
    const studentSkillOffered = studentContext?.skills_offered?.[0] || 'your taught skills';
    const studentGoal = studentContext?.active_learning_goal || studentContext?.learning_goals?.[0] || 'Skill Mastery';
    const currentLevel = studentContext?.skill_levels?.[studentSkillWanted] || 'Beginner';

    // 1. Skill Gap Analysis & Diagnostic guidance
    if (q.includes('gap') || q.includes('analyze my skill') || q.includes('missing')) {
      answer = `### 🎯 Personalized Skill Gap Analysis
**Student Profile:** ${studentContext?.name || 'Student Member'} (${studentContext?.course || 'Campus Scholar'})
- **Target Goal:** ${studentGoal}
- **Current Assessed Level:** ${currentLevel} in ${studentSkillWanted}

**Identified Skill Gaps:**
1. **Prerequisite Foundation:** Need deeper grounding in intermediate data structures and design principles before advanced application.
2. **Practical Synthesis:** Lack of verifiable project deliverables connecting theory to real scenarios.
3. **Peer Feedback Loop:** Needs peer code/design critique to identify edge-case blind spots.

**Recommended Next Topics to Learn:**
- Focus on foundational syntax, libraries, and modular structure.
- Check the **Skill Development Hub** in your dashboard to view your complete milestone roadmap and matched campus tutors!`;
    }

    // 2. Personalized Learning Path / Roadmap
    else if (q.includes('path') || q.includes('roadmap') || q.includes('learn next') || q.includes('curriculum')) {
      answer = `### 🗺️ Personalized Learning Pathway for ${studentGoal}
Based on your profile (${currentLevel} level in ${studentSkillWanted}):

1. **Phase 1: Core Fundamentals & Prerequisite Foundations**
   - Syntax conventions, vectorization/grid frameworks, and essential toolchains.
   - *Practice Exercise:* Guided mini-project with strict assertions or 8pt grid components.
2. **Phase 2: Data Wrangling & Modular Architecture**
   - Handling real-world datasets or multi-state component variants.
   - *Deliverable:* Interactive prototype or data exploration notebook.
3. **Phase 3: Peer Barter Collaboration**
   - Trade your knowledge in **${studentSkillOffered}** with a campus peer to review code and debug together!

Visit the **Skill Development** tab in your navigation to track each milestone!`;
    }

    // 3. Recommended Practice Project
    else if (q.includes('practice') || q.includes('project') || q.includes('exercise')) {
      answer = `### 🛠️ Recommended Practice Activity (${currentLevel} Level)
For your focus on **${studentSkillWanted}**:

- **Project Title:** End-to-End Real Campus Tool
- **Objective:** Build a practical deliverable that demonstrates competency in your identified gap areas.
- **Estimated Time:** 4 - 6 hours
- **Deliverable:** GitHub repo or Figma design file ready for peer exchange review.
- **Peer Collaboration Tip:** Once finished, ask an exchange partner who specializes in ${studentSkillWanted} to conduct a 30-minute code or design review!`;
    }

    // 4. Partner Matching Guidance based on student's requirements
    else if (q.includes('partner') || q.includes('who can teach') || q.includes('mentor') || q.includes('find partner')) {
      answer = `### 🤝 Peer Barter Partner Guidance
You are currently offering **${studentSkillOffered}** and seeking guidance in **${studentSkillWanted}**.

- Our matching engine looks for reciprocal exchange: students who offer **${studentSkillWanted}** and are looking to learn **${studentSkillOffered}** (+50 mutual bonus).
- You can navigate to **"Skill Development"** to see partners directly mapped to your active learning milestone, or browse **"Find Partners"** to filter by skills and campus.`;
    }

    // 5. How skill exchange works
    else if (q.includes('work') || q.includes('how does skill exchange work') || q.includes('how it works')) {
      answer = `Skill exchange operates on an integrated learning & barter model:
1. **Profile & Assessment:** Define your offered skills, learning wishlist, and current skill level (Beginner, Intermediate, Advanced).
2. **AI Gap Diagnosis:** The RAG engine identifies your skill gaps and builds a personalized learning roadmap with practice activities.
3. **Campus Peer Matching:** Match with students who can teach you the specific skills needed for your roadmap in trade for what you teach.
4. **Active Exchanges & Review:** Pair up for weekly study sessions and earn verified ratings upon completion!`;
    }

    // 6. Matching algorithm
    else if (q.includes('match') || q.includes('algorithm') || q.includes('score')) {
      answer = `The **Smart Matching Engine** calculates compatibility between two students using a normalized 0-100% algorithm:
- **Mutual Skill Barter (+50 pts):** When Student A offers what Student B wants, AND Student B offers what Student A wants.
- **One-way Skill Overlap (+25-30 pts):** When one student teaches what the other wants.
- **Campus Alignment (+10 pts):** Shared university campus.
- **Shared Interests (+8-10 pts):** Overlapping academic, hackathon, or creative tags.`;
    }

    // Fallback grounded in top retrieved chunk + student context
    else {
      if (topChunk && topChunk.similarityScore > 0.25) {
        answer = `### 📚 Knowledge Base Guidance
${topChunk.chunk.content}

${studentContext ? `\n*Note for your profile:* You are actively tracking **${studentSkillWanted}** towards **${studentGoal}**. You can view your step-by-step progress and practice projects in the **Skill Development** tab.` : ''}`;
      } else {
        answer = `I am SkillMate AI, integrated directly into your campus skill development journey!
You can ask me to:
- **"Analyze my skill gap in ${studentSkillWanted}"**
- **"What should I learn next for ${studentGoal}?"**
- **"Suggest a practice project for my level"**
- **"Find a campus peer to help with my current milestone"**`;
      }
    }

    return {
      answer,
      retrievedContexts,
      query,
      confidence: topChunk?.similarityScore || 0.88,
    };
  },

  getInitialMessages(studentContext?: UserProfile | null): ChatMessage[] {
    const goalText = studentContext?.active_learning_goal || studentContext?.skills_wanted?.[0];
    const greeting = studentContext
      ? `Hi ${studentContext.name.split(' ')[0]}! I'm SkillMate AI, connected to your skill development journey. I can analyze your skill gaps, guide you through your ${goalText ? `"${goalText}"` : 'learning'} pathway, suggest practice projects, and help match you with campus tutors.`
      : "Hi! I'm SkillMate AI. I help students assess skill gaps, build personalized learning roadmaps, and match with peer tutors using our campus RAG knowledge base.";

    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  },
};
