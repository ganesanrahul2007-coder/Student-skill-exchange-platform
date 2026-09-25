import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ExchangeRequest, RequestStatus } from '../types/request';
import { ActiveExchange } from '../types/exchange';
import { ReviewRating } from '../types/rating';
import { requestService } from '../services/requestService';
import { exchangeService } from '../services/exchangeService';
import { ratingService } from '../services/ratingService';
import { useAuth } from './AuthContext';

interface ExchangeContextType {
  incomingRequests: ExchangeRequest[];
  outgoingRequests: ExchangeRequest[];
  pendingIncomingCount: number;
  activeExchanges: ActiveExchange[];
  completedExchanges: ActiveExchange[];
  sendRequest: (receiverId: string, skillOffered: string, skillRequested: string, message: string) => Promise<boolean>;
  acceptRequest: (requestId: string) => Promise<boolean>;
  rejectRequest: (requestId: string) => Promise<boolean>;
  cancelRequest: (requestId: string) => Promise<boolean>;
  completeExchange: (exchangeId: string) => Promise<boolean>;
  submitReview: (reviewedId: string, rating: number, feedback: string, exchangeId?: string, skill?: string) => Promise<boolean>;
  refreshExchangeData: () => void;
  getReviewsForUser: (userId: string) => ReviewRating[];
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const ExchangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<ExchangeRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ExchangeRequest[]>([]);
  const [activeExchanges, setActiveExchanges] = useState<ActiveExchange[]>([]);
  const [completedExchanges, setCompletedExchanges] = useState<ActiveExchange[]>([]);

  const loadData = useCallback(() => {
    if (!user) {
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setActiveExchanges([]);
      setCompletedExchanges([]);
      return;
    }

    const inReqs = requestService.getIncomingRequests(user.id);
    const outReqs = requestService.getOutgoingRequests(user.id);
    const exchanges = exchangeService.getUserExchanges(user.id);

    setIncomingRequests(inReqs);
    setOutgoingRequests(outReqs);
    setActiveExchanges(exchanges.filter((e) => e.status === 'active'));
    setCompletedExchanges(exchanges.filter((e) => e.status === 'completed'));
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sendRequest = async (
    receiverId: string,
    skillOffered: string,
    skillRequested: string,
    message: string
  ): Promise<boolean> => {
    if (!user) return false;
    requestService.sendRequest(user.id, receiverId, skillOffered, skillRequested, message);
    loadData();
    return true;
  };

  const acceptRequest = async (requestId: string): Promise<boolean> => {
    if (!user) return false;
    const req = requestService.getAllRequests().find((r) => r.id === requestId);
    if (!req) return false;

    // Update request state
    requestService.updateRequestStatus(requestId, 'accepted');

    // Create an active exchange
    exchangeService.createFromAcceptedRequest(
      requestId,
      req.sender_id,
      req.receiver_id,
      req.skill_offered,
      req.skill_requested
    );

    loadData();
    return true;
  };

  const rejectRequest = async (requestId: string): Promise<boolean> => {
    requestService.updateRequestStatus(requestId, 'rejected');
    loadData();
    return true;
  };

  const cancelRequest = async (requestId: string): Promise<boolean> => {
    requestService.updateRequestStatus(requestId, 'cancelled');
    loadData();
    return true;
  };

  const completeExchange = async (exchangeId: string): Promise<boolean> => {
    exchangeService.markCompleted(exchangeId);
    loadData();
    return true;
  };

  const submitReview = async (
    reviewedId: string,
    rating: number,
    feedback: string,
    exchangeId?: string,
    skill?: string
  ): Promise<boolean> => {
    if (!user) return false;
    ratingService.submitReview(user.id, reviewedId, rating, feedback, exchangeId, skill);
    loadData();
    return true;
  };

  const getReviewsForUser = (userId: string): ReviewRating[] => {
    return ratingService.getReviewsForStudent(userId);
  };

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'pending').length;

  return (
    <ExchangeContext.Provider
      value={{
        incomingRequests,
        outgoingRequests,
        pendingIncomingCount,
        activeExchanges,
        completedExchanges,
        sendRequest,
        acceptRequest,
        rejectRequest,
        cancelRequest,
        completeExchange,
        submitReview,
        refreshExchangeData: loadData,
        getReviewsForUser,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};
