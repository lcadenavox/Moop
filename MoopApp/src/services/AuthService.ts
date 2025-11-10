import { User } from '../types';
import { auth } from './firebase';
import { ApiError } from './ApiService';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';

export interface LoginResult {
  token: string;
  user: User;
}

// Friendly messages for common Firebase auth errors
function mapFirebaseError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email ou senha incorretos';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 'auth/email-already-in-use':
      return 'Este email já está em uso';
    case 'auth/weak-password':
      return 'A senha é muito fraca';
    case 'auth/network-request-failed':
      return 'Falha de rede. Verifique sua conexão';
    case 'auth/invalid-api-key':
      return 'Chave de API inválida (verifique a configuração do Firebase)';
    default:
      return error?.message || 'Erro de autenticação';
  }
}

const AuthService = {
  async login(email: string, password: string): Promise<LoginResult> {
    if (!email || !password) throw new Error('Informe email e senha');
    try {
      if (!auth) throw new Error('Firebase não inicializado');
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      const name = cred.user.displayName ?? email.split('@')[0];
      return { token, user: { id: cred.user.uid as any, name, email: cred.user.email ?? email } };
    } catch (e: any) {
      throw new ApiError(mapFirebaseError(e));
    }
  },

  async register({ name, email, password }: { name: string; email: string; password: string; }): Promise<LoginResult> {
    if (!email || !password) throw new Error('Informe email e senha');
    try {
      if (!auth) throw new Error('Firebase não inicializado');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        try { await updateProfile(cred.user, { displayName: name }); } catch {
          // non-critical: profile displayName update can fail without blocking auth
        }
      }
      const token = await cred.user.getIdToken();
      return { token, user: { id: cred.user.uid as any, name: name || email.split('@')[0], email: cred.user.email ?? email } };
    } catch (e: any) {
      throw new ApiError(mapFirebaseError(e));
    }
  },

  async logout(): Promise<void> {
    try {
      if (!auth) return;
      await signOut(auth);
    } catch (e) {
      // not fatal for UI
      console.warn('Firebase signOut falhou:', (e as any)?.message || e);
    }
  },
};

export default AuthService;