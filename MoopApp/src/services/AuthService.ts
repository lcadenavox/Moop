import { User } from '../types';
import ApiService from './ApiService';

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return ApiService.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    });
  }

  async register(user: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user: User }> {
    return ApiService.post<{ token: string; user: User }>('/auth/register', user);
  }

  async logout(): Promise<void> {
    return ApiService.post<void>('/auth/logout');
  }
}

export default AuthService.getInstance();