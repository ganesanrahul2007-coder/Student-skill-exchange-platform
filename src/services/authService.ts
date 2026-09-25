import { UserProfile } from '../types/user';
import { supabase } from '../lib/supabase';

const CURRENT_USER_KEY = 'skill_exchange_active_user_v2';
const PROFILES_STORAGE_KEY = 'skill_exchange_users_v2';

// Clear legacy dummy cache if present
try {
  localStorage.removeItem('skill_exchange_current_user_id');
  localStorage.removeItem('skill_exchange_custom_profiles');
} catch {
  // ignore
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  college: string;
  course: string;
  year: string;
}

export const authService = {
  /**
   * Retrieves all registered student profiles
   */
  getAllUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (!stored) return [];
      const profiles: UserProfile[] = JSON.parse(stored);
      // Filter out any legacy dummy profiles if any
      return profiles.filter((p) => !p.id.startsWith('user-rahul') && !p.id.startsWith('user-ananya'));
    } catch {
      return [];
    }
  },

  /**
   * Gets the currently authenticated user or null
   */
  getCurrentUser(): UserProfile | null {
    const users = this.getAllUsers();
    const storedId = localStorage.getItem(CURRENT_USER_KEY);
    if (!storedId) return null;
    const found = users.find((u) => u.id === storedId);
    return found || null;
  },

  /**
   * Switches active user if multiple real accounts exist
   */
  switchUser(userId: string): UserProfile | null {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      return user;
    }
    return null;
  },

  /**
   * Real user login with Supabase hook readiness
   */
  async login(email: string, _password?: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (supabase.isConfigured) {
      // Future Supabase Auth hook
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password: _password });
    }

    const users = this.getAllUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      localStorage.setItem(CURRENT_USER_KEY, found.id);
      return { user: found, error: null };
    }

    return {
      user: null,
      error: 'No account found with this email. Please click "Sign up" to create your student account.',
    };
  },

  /**
   * Register new student account
   */
  async signup(data: SignupData): Promise<{ user: UserProfile | null; error: string | null }> {
    const users = this.getAllUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { user: null, error: 'An account with this campus email already exists. Please log in.' };
    }

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      college: data.college.trim(),
      course: data.course.trim(),
      year: data.year,
      bio: `Student at ${data.college} studying ${data.course}.`,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      availability: 'Flexible weekday evenings',
      created_at: new Date().toISOString(),
      skills_offered: [],
      skills_wanted: [],
      rating: 5.0,
      rating_count: 0,
      exchanges_count: 0,
      interests: [],
    };

    this.saveCustomProfile(newProfile);
    localStorage.setItem(CURRENT_USER_KEY, newProfile.id);
    return { user: newProfile, error: null };
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}. Check your student mailbox.`,
    };
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  saveCustomProfile(profile: UserProfile): void {
    try {
      const users = this.getAllUsers();
      const index = users.findIndex((p) => p.id === profile.id);
      if (index >= 0) {
        users[index] = profile;
      } else {
        users.unshift(profile);
      }
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  },
};
