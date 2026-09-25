import { UserProfile } from './user';

export type ExchangeStatus = 'active' | 'completed';

export interface ActiveExchange {
  id: string;
  request_id: string;
  user1_id: string;
  user2_id: string;
  skill_offered_by_user1: string;
  skill_offered_by_user2: string;
  status: ExchangeStatus;
  start_date: string;
  last_activity: string;
  completed_at?: string;
  meeting_link?: string;
  notes?: string;

  // Joined partner reference relative to current viewer
  partner?: UserProfile;
  my_offered_skill?: string;
  partner_offered_skill?: string;
  rated_by_current_user?: boolean;
}
