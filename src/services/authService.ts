import { WalletData } from '../types';

interface SessionData extends WalletData {
  email?: string;
}

class AuthService {
  private readonly SESSION_KEY = 'geko_session';

  saveSession(data: SessionData): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  getSession(): SessionData | null {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load session:', e);
      return null;
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }
}

export const authService = new AuthService();
