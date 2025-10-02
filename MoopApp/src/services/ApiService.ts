import AsyncStorage from '@react-native-async-storage/async-storage';

// Detecta se estamos em desenvolvimento web
const isWeb = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';

// Permite sobrescrever via variável de ambiente (Expo): EXPO_PUBLIC_API_BASE_URL
const ENV_API_BASE = (process.env as any)?.EXPO_PUBLIC_API_BASE_URL as string | undefined;

// Padrão seguro: Web usa HTTPS por padrão (para casar com Swagger em https). Native mantém HTTPS também.
// Se precisar HTTP (em emuladores), configure EXPO_PUBLIC_API_BASE_URL.
const DEFAULT_BASE = 'https://localhost:7054/api';
const API_BASE_URL = (ENV_API_BASE && ENV_API_BASE.trim().length > 0)
  ? ENV_API_BASE.replace(/\/$/, '')
  : DEFAULT_BASE;

export interface ApiError {
  message: string;
  status?: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`;
        try {
          const err = await response.json();
          if (err && (err.message || err.title)) {
            message = err.message || err.title;
          }
        } catch {}
        throw new ApiError(message, response.status);
      }

      // Algumas respostas podem não ter corpo
      const text = await response.text();
      try {
        return (text ? JSON.parse(text) : ({} as any)) as T;
      } catch {
        // Se não for JSON, retornar texto como any
        return (text as any) as T;
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      // Repassar erros de rede; ajuste EXPO_PUBLIC_API_BASE_URL se necessário (ex.: https/http)
      throw error as Error;
    }
  }


  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export default new ApiService();