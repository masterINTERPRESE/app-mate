import { supabase } from './supabaseClient';
import type { Achievement } from './gamification';

// The User type now needs to align with the data we get from Supabase.
// It's a combination of the auth user and the profiles table.
export interface User {
  id: string;
  email: string;
  name: string;
  rank: string;
  xp: number;
  createdAt: string; // Supabase returns ISO strings
  stats: {
    totalProblems: number;
    correctAnswers: number;
    currentStreak: number;
    maxStreak: number;
    averageTime: number;
    fastestTime: number;
    achievements: Achievement[];
  };
}

class AuthService {

  async register(email: string, password: string, name: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Pass the user's name in the metadata to be used by our trigger
        data: { name }
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }
    if (!authData.user) {
        throw new Error("Registration failed: no user returned.");
    }

    // After sign up, Supabase trigger creates the profile. We fetch it here.
    // There can be a small delay, so we retry a few times.
    for (let i = 0; i < 5; i++) {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: "exact-one-row" error
            throw new Error(profileError.message);
        }

        if (profileData) {
            return this.combineUserData(authData.user, profileData);
        }
        await new Promise(res => setTimeout(res, 500)); // wait 500ms
    }

    throw new Error("Failed to retrieve user profile after registration.");
  }

  async login(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }
    if (!authData.user) {
        throw new Error("Login failed: no user returned.");
    }

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        throw new Error(profileError.message);
    }

    return this.combineUserData(authData.user, profileData);
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        // This might happen if the profile wasn't created, log it but don't crash
        console.error("Error fetching profile for current user:", profileError.message);
        return null;
    }

    return this.combineUserData(authData.user, profileData);
  }

  // This is the only method that will now call our own backend API route
  async updateUserStats(problemResult: {
    isCorrect: boolean;
    timeSeconds: number;
    difficulty: number;
  }): Promise<User> {
     const response = await fetch('/api/update-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problemResult),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar las estadísticas');
    }

    return response.json();
  }

  // A helper to combine auth user data and profile data into our app's User type
  private combineUserData(authUser: any, profile: any): User {
      return {
          id: authUser.id,
          email: authUser.email!,
          createdAt: authUser.created_at,
          name: profile.name,
          rank: profile.rank,
          xp: profile.xp,
          stats: profile.stats,
      }
  }
}

export const authService = new AuthService();
