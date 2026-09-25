import { UserProfile } from './user';

export interface ReviewRating {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  exchange_id?: string;
  rating: number; // 1 to 5
  feedback: string;
  skill_exchanged?: string;
  created_at: string;

  // Joined reviewer info
  reviewer?: UserProfile;
}

export interface RatingStats {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
