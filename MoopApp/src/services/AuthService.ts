import { User } from '../types';

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    // Temporary local auth: validate minimal fields and return a fake token
    if (!email || !password) {
      throw new Error('Credenciais inválidas');
    }
    return {
      token: 'dev-token',
      user: { email, name: email.split('@')[0] },
    };
  }

  async register(user: { name: string; email: string; password: string; }): Promise<{ token: string; user: User }> {
    if (!user.email || !user.password) {
      throw new Error('Dados inválidos de cadastro');
    }
    return {
      token: 'dev-token',
      user: { email: user.email, name: user.name },
    };
  }

  async logout(): Promise<void> {
    // No-op for local auth
    return;
  }
}

export default AuthService.getInstance();