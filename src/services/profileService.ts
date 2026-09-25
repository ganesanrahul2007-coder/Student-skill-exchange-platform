import { UserProfile } from '../types/user';
import { authService } from './authService';

export const profileService = {
  getProfile(id: string): UserProfile | null {
    const users = authService.getAllUsers();
    return users.find((u) => u.id === id) || null;
  },

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = authService.getAllUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return null;

    const updatedUser: UserProfile = {
      ...user,
      ...updates,
    };

    authService.saveCustomProfile(updatedUser);
    return updatedUser;
  },

  listStudents(): UserProfile[] {
    return authService.getAllUsers();
  },

  /**
   * Calculates profile completion percentage based on essential fields
   */
  calculateProfileCompletion(profile: UserProfile): number {
    let score = 0;
    if (profile.name) score += 15;
    if (profile.college) score += 15;
    if (profile.course && profile.year) score += 15;
    if (profile.bio && profile.bio.length > 20) score += 15;
    if (profile.skills_offered && profile.skills_offered.length > 0) score += 20;
    if (profile.skills_wanted && profile.skills_wanted.length > 0) score += 15;
    if (profile.availability) score += 5;
    return Math.min(score, 100);
  },
};
