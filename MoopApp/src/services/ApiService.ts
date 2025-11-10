import AsyncStorage from '@react-native-async-storage/async-storage';

// =============================
// Configuração de Base da API
// =============================
// Você pode sobrescrever a base via variável de ambiente Expo:
//   EXPO_PUBLIC_API_BASE_URL   -> ex: https://192.168.0.10:7054/api  (sem versão)
//   EXPO_PUBLIC_API_VERSION    -> ex: v1 (não incluir barras)
// Ou simplesmente definir a base já incluindo a versão:
//   EXPO_PUBLIC_API_BASE_URL=https://192.168.0.10:7054/api/v1
// Caso a versão esteja definida separadamente ela será concatenada.
// Screenshot do Swagger mostra rotas em /api/v1/..., então sem definir nada
// o app chamaria /api/..., gerando 404. Ajuste uma das variáveis conforme necessidade.

const ENV_API_BASE = (process.env as any)?.EXPO_PUBLIC_API_BASE_URL as string | undefined;
const ENV_API_VERSION = (process.env as any)?.EXPO_PUBLIC_API_VERSION as string | undefined;
const ENV_API_KEY = (process.env as any)?.EXPO_PUBLIC_API_KEY as string | undefined; // opcional: X-Api-Key

// Padrão seguro: HTTPS no localhost (compatível com Swagger dev cert).
const DEFAULT_BASE = 'https://localhost:7054/api';
const RAW_BASE = (ENV_API_BASE && ENV_API_BASE.trim().length > 0)
  ? ENV_API_BASE.replace(/\/$/, '')
  : DEFAULT_BASE;

// Só adiciona a versão se o base ainda não a contém e a versão foi especificada.
const hasVersionEnv = !!(ENV_API_VERSION && ENV_API_VERSION.trim().length > 0);
const versionClean = hasVersionEnv ? ENV_API_VERSION!.replace(/^\/*|\/*$/g, '') : '';
const API_VERSION_SEGMENT = hasVersionEnv ? `/${versionClean}` : '';

const alreadyHasVersion = hasVersionEnv
  ? new RegExp(`/(?:${versionClean})(?:/|$)`).test(RAW_BASE)
  : true; // se não há versão a adicionar, consideramos que já está ok

const API_BASE_URL = alreadyHasVersion ? RAW_BASE : `${RAW_BASE}${API_VERSION_SEGMENT}`;

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Apply a default timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutMs = 10000; // 10s default timeout
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const token = await AsyncStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (ENV_API_KEY) {
        headers['X-Api-Key'] = ENV_API_KEY;
      }

      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`;
        try {
          const err = await response.json();
          if (err && (err.message || err.title)) {
            message = err.message || err.title;
          }
        } catch {
          // ignore: backend may not return JSON on errors
        }
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
      if ((error as any)?.name === 'AbortError') {
        throw new ApiError('Tempo de requisição excedido. Verifique sua conexão com a API.');
      }
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