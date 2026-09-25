import { ExchangeRequest, RequestStatus } from '../types/request';
import { authService } from './authService';

const REQUESTS_STORAGE_KEY = 'skill_exchange_requests_store_v2';

// Clear legacy dummy cache if present
try {
  localStorage.removeItem('skill_exchange_requests_store');
} catch {
  // ignore
}

export const requestService = {
  getAllRequests(): ExchangeRequest[] {
    try {
      const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveRequests(requests: ExchangeRequest[]): void {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    } catch {
      // ignore
    }
  },

  getIncomingRequests(userId: string): ExchangeRequest[] {
    const all = this.getAllRequests();
    const users = authService.getAllUsers();
    return all
      .filter((r) => r.receiver_id === userId)
      .map((r) => ({
        ...r,
        sender: users.find((u) => u.id === r.sender_id),
        receiver: users.find((u) => u.id === r.receiver_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getOutgoingRequests(userId: string): ExchangeRequest[] {
    const all = this.getAllRequests();
    const users = authService.getAllUsers();
    return all
      .filter((r) => r.sender_id === userId)
      .map((r) => ({
        ...r,
        sender: users.find((u) => u.id === r.sender_id),
        receiver: users.find((u) => u.id === r.receiver_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  sendRequest(senderId: string, receiverId: string, skillOffered: string, skillRequested: string, message: string): ExchangeRequest {
    const all = this.getAllRequests();
    const newReq: ExchangeRequest = {
      id: `req-${Date.now()}`,
      sender_id: senderId,
      receiver_id: receiverId,
      skill_offered: skillOffered,
      skill_requested: skillRequested,
      message: message.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    all.unshift(newReq);
    this.saveRequests(all);
    return newReq;
  },

  updateRequestStatus(requestId: string, status: RequestStatus): ExchangeRequest | null {
    const all = this.getAllRequests();
    const index = all.findIndex((r) => r.id === requestId);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      status,
      updated_at: new Date().toISOString(),
    };

    this.saveRequests(all);
    return all[index];
  },
};
