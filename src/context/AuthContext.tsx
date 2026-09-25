import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { authService, SignupData } from '../services/authService';
import { profileService } from '../services/profileService';

interface AuthContextType {
  user: UserProfile | null;
  allUsers: UserProfile[];
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  profileCompletion: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => authService.getAllUsers());

  useEffect(() => {
    setAllUsers(authService.getAllUsers());
  }, [user]);

  const login = async (email: string, password?: string) => {
    const res = await authService.login(email, password);
    if (res.user) {
      setUser(res.user);
      setAllUsers(authService.getAllUsers());
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to sign in' };
  };

  const signup = async (data: SignupData) => {
    const res = await authService.signup(data);
    if (res.user) {
      setUser(res.user);
      setAllUsers(authService.getAllUsers());
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to sign up' };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchUser = (userId: string) => {
    const switched = authService.switchUser(userId);
    setUser(switched);
    setAllUsers(authService.getAllUsers());
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = profileService.updateProfile(user.id, updates);
    if (updated) {
      setUser(updated);
      setAllUsers(authService.getAllUsers());
    }
  };

  const profileCompletion = user ? profileService.calculateProfileCompletion(user) : 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        switchUser,
        updateProfile,
        profileCompletion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
