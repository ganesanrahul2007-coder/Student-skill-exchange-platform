import { ActiveExchange } from '../types/exchange';
import { authService } from './authService';

const EXCHANGES_STORAGE_KEY = 'skill_exchange_active_sessions_v2';

// Clear legacy dummy cache if present
try {
  localStorage.removeItem('skill_exchange_active_sessions');
} catch {
  // ignore
}

export const exchangeService = {
  getAllExchanges(): ActiveExchange[] {
    try {
      const stored = localStorage.getItem(EXCHANGES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveExchanges(exchanges: ActiveExchange[]): void {
    try {
      localStorage.setItem(EXCHANGES_STORAGE_KEY, JSON.stringify(exchanges));
    } catch {
      // ignore
    }
  },

  createFromAcceptedRequest(
    requestId: string,
    user1Id: string,
    user2Id: string,
    skill1: string,
    skill2: string
  ): ActiveExchange {
    const exchanges = this.getAllExchanges();
    const newExch: ActiveExchange = {
      id: `exch-${Date.now()}`,
      request_id: requestId,
      user1_id: user1Id,
      user2_id: user2Id,
      skill_offered_by_user1: skill1,
      skill_offered_by_user2: skill2,
      status: 'active',
      start_date: new Date().toISOString(),
      last_activity: 'Exchange started just now! Ready for first session.',
      meeting_link: 'https://meet.google.com/new-student-exchange',
      notes: 'Initial session planned.',
    };

    exchanges.unshift(newExch);
    this.saveExchanges(exchanges);
    return newExch;
  },

  getUserExchanges(userId: string): ActiveExchange[] {
    const all = this.getAllExchanges();
    const users = authService.getAllUsers();

    return all
      .filter((e) => e.user1_id === userId || e.user2_id === userId)
      .map((e) => {
        const isUser1 = e.user1_id === userId;
        const partnerId = isUser1 ? e.user2_id : e.user1_id;
        const partner = users.find((u) => u.id === partnerId);
        return {
          ...e,
          partner,
          my_offered_skill: isUser1 ? e.skill_offered_by_user1 : e.skill_offered_by_user2,
          partner_offered_skill: isUser1 ? e.skill_offered_by_user2 : e.skill_offered_by_user1,
        };
      });
  },

  markCompleted(exchangeId: string): ActiveExchange | null {
    const all = this.getAllExchanges();
    const index = all.findIndex((e) => e.id === exchangeId);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      status: 'completed',
      completed_at: new Date().toISOString(),
      last_activity: 'Marked as completed. Ready for review.',
    };

    this.saveExchanges(all);
    return all[index];
  },
};
