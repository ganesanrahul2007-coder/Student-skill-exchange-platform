import { UserProfile } from './user';

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface ExchangeRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  skill_offered: string;
  skill_requested: string;
  message: string;
  status: RequestStatus;
  created_at: string;
  updated_at?: string;

  // Joined representations
  sender?: UserProfile;
  receiver?: UserProfile;
}
