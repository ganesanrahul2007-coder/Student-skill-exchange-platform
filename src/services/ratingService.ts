import { ReviewRating, RatingStats } from '../types/rating';
import { authService } from './authService';

const RATINGS_STORAGE_KEY = 'skill_exchange_ratings_store_v2';

// Clear legacy dummy cache if present
try {
  localStorage.removeItem('skill_exchange_ratings_store');
} catch {
  // ignore
}

export const ratingService = {
  getAllRatings(): ReviewRating[] {
    try {
      const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveRatings(ratings: ReviewRating[]): void {
    try {
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    } catch {
      // ignore
    }
  },

  getReviewsForStudent(studentId: string): ReviewRating[] {
    const all = this.getAllRatings();
    const users = authService.getAllUsers();
    return all
      .filter((r) => r.reviewed_id === studentId)
      .map((r) => ({
        ...r,
        reviewer: users.find((u) => u.id === r.reviewer_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getReviewsGivenByStudent(studentId: string): ReviewRating[] {
    const all = this.getAllRatings();
    const users = authService.getAllUsers();
    return all
      .filter((r) => r.reviewer_id === studentId)
      .map((r) => ({
        ...r,
        reviewer: users.find((u) => u.id === r.reviewer_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getRatingStats(studentId: string): RatingStats {
    const reviews = this.getAllRatings().filter((r) => r.reviewed_id === studentId);
    if (reviews.length === 0) {
      return {
        average: 5.0,
        count: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of reviews) {
      const star = Math.min(Math.max(Math.round(r.rating), 1), 5);
      distribution[star] = (distribution[star] || 0) + 1;
      sum += r.rating;
    }

    return {
      average: Number((sum / reviews.length).toFixed(1)),
      count: reviews.length,
      distribution: distribution as RatingStats['distribution'],
    };
  },

  submitReview(
    reviewerId: string,
    reviewedId: string,
    rating: number,
    feedback: string,
    exchangeId?: string,
    skillExchanged?: string
  ): ReviewRating {
    const all = this.getAllRatings();
    const newReview: ReviewRating = {
      id: `rate-${Date.now()}`,
      reviewer_id: reviewerId,
      reviewed_id: reviewedId,
      exchange_id: exchangeId,
      rating: Math.min(Math.max(rating, 1), 5),
      feedback: feedback.trim(),
      skill_exchanged: skillExchanged,
      created_at: new Date().toISOString(),
    };

    all.unshift(newReview);
    this.saveRatings(all);

    // Update the reviewed user's average rating & rating_count
    const stats = this.getRatingStats(reviewedId);
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id === reviewedId) {
      authService.saveCustomProfile({
        ...currentUser,
        rating: stats.average,
        rating_count: stats.count,
      });
    }

    return newReview;
  },
};
