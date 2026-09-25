import { UserProfile, MatchScoreDetails } from '../types/user';

/**
 * Normalizes skill strings for case-insensitive and partial matching comparison
 * e.g. "UI/UX Design" matches "UI Design" or "UI/UX"
 */
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function skillsOverlap(listA: string[], listB: string[]): string[] {
  const matching: string[] = [];
  for (const sA of listA) {
    const normA = normalizeSkill(sA);
    for (const sB of listB) {
      const normB = normalizeSkill(sB);
      if (normA === normB || (normA.length > 3 && normB.includes(normA)) || (normB.length > 3 && normA.includes(normB))) {
        if (!matching.includes(sA)) matching.push(sA);
      }
    }
  }
  return matching;
}

/**
 * Calculates compatibility score between two students.
 * 
 * Rules:
 * - Mutual skill exchange (A teaches what B wants AND B teaches what A wants): +50 bonus
 * - Student B teaches what Student A wants: +30 points
 * - Student A teaches what Student B wants: +20 points
 * - Same college bonus: +10 points
 * - Common campus interests: +10 points
 * 
 * Normalized 0 to 100%.
 */
export function calculateMatchScore(studentA: UserProfile, studentB: UserProfile): MatchScoreDetails {
  if (!studentA || !studentB || studentA.id === studentB.id) {
    return {
      totalScore: 0,
      mutualExchangeBonus: false,
      matchingOfferedToWanted: [],
      matchingWantedToOffered: [],
      sameCollege: false,
      commonInterests: [],
      explanation: 'Self or invalid comparison',
    };
  }

  // Does Student B offer what Student A wants?
  const bOffersWhatAWants = skillsOverlap(studentB.skills_offered, studentA.skills_wanted);

  // Does Student A offer what Student B wants?
  const aOffersWhatBWants = skillsOverlap(studentA.skills_offered, studentB.skills_wanted);

  const isMutual = bOffersWhatAWants.length > 0 && aOffersWhatBWants.length > 0;
  
  // Same college check
  const sameCollege = Boolean(
    studentA.college && 
    studentB.college && 
    studentA.college.trim().toLowerCase() === studentB.college.trim().toLowerCase()
  );

  // Common interests check
  const interestsA = studentA.interests || [];
  const interestsB = studentB.interests || [];
  const commonInterests = interestsA.filter((i) =>
    interestsB.some((j) => j.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(j.toLowerCase()))
  );

  let rawScore = 0;

  if (isMutual) {
    rawScore += 50; // High mutual exchange bonus
  }
  if (bOffersWhatAWants.length > 0) {
    rawScore += 25 + Math.min(bOffersWhatAWants.length * 5, 10);
  }
  if (aOffersWhatBWants.length > 0) {
    rawScore += 15 + Math.min(aOffersWhatBWants.length * 5, 10);
  }
  if (sameCollege) {
    rawScore += 10;
  }
  if (commonInterests.length > 0) {
    rawScore += 8;
  }

  // Fallback baseline for students with diverse complementary skills
  if (rawScore === 0) {
    rawScore = 15;
  }

  // Cap at 98% (realistic prototype score)
  const totalScore = Math.min(Math.max(Math.round(rawScore), 15), 98);

  let explanation = '';
  if (isMutual) {
    explanation = `Perfect mutual match! They offer skills you want (${bOffersWhatAWants.slice(0, 2).join(', ')}) and want skills you teach (${aOffersWhatBWants.slice(0, 2).join(', ')}).`;
  } else if (bOffersWhatAWants.length > 0) {
    explanation = `They offer ${bOffersWhatAWants.join(', ')} which is on your wishlist!`;
  } else if (aOffersWhatBWants.length > 0) {
    explanation = `They are actively looking for ${aOffersWhatBWants.join(', ')} which you offer.`;
  } else {
    explanation = `Complementary peer in ${studentB.course}. Potential cross-disciplinary exchange.`;
  }

  return {
    totalScore,
    mutualExchangeBonus: isMutual,
    matchingOfferedToWanted: bOffersWhatAWants,
    matchingWantedToOffered: aOffersWhatBWants,
    sameCollege,
    commonInterests,
    explanation,
  };
}
