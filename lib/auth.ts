import type { Achievement } from "./gamification"

// Update the User type to include the new 'role' field
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  rank: string;
  xp: number;
  createdAt: string;
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

  async login(email: string, password: string): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    return response.json();
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrarse');
    }

    // After registering, we log the user in to get the session cookie
    return this.login(email, password);
  }

  async logout(): Promise<void> {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cerrar sesión');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/user/me');
      if (response.status === 401) {
        return null; // Not authenticated
      }
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  async updateUserStats(problemResult: {
    isCorrect: boolean;
    timeSeconds: number;
    difficulty: number;
  }): Promise<User> {
     const response = await fetch('/api/game/stats', {
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

  // New admin method
  async getAllUsers(): Promise<User[]> {
      const response = await fetch('/api/admin/users');
      if(!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch all users');
      }
      return response.json();
  }
}

export const authService = new AuthService();
