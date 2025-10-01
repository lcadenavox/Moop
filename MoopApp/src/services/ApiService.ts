// Detecta se estamos em desenvolvimento web
const isWeb = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';

// Em desenvolvimento web, usar HTTP ao invés de HTTPS
const API_BASE_URL = isWeb && isDev 
  ? 'http://localhost:7054/api' 
  : 'https://localhost:7054/api';

export interface ApiError {
  message: string;
  status?: number;
}

// Flag para simular modo offline em desenvolvimento
const OFFLINE_MODE = true; 
export const IS_OFFLINE_MODE = OFFLINE_MODE;

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Se estiver em modo offline, simular respostas
    if (OFFLINE_MODE) {
      return this.simulateApiResponse<T>(endpoint, options);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Em caso de erro de rede, tentar modo simulado
      console.warn('API não disponível, usando modo simulado:', error);
      return this.simulateApiResponse<T>(endpoint, options);
    }
  }

  private async simulateApiResponse<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Simular respostas baseadas no endpoint
    if (endpoint.includes('/health')) {
      return ({ status: 'ok' } as any) as T;
    }
    if (endpoint.includes('/auth/login')) {
      // Verificar credenciais de teste
      if (body.email === 'teste@moop.com' && body.password === '123456') {
        return {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: body.email,
            name: 'Usuário Teste'
          }
        } as T;
      } else {
        throw new ApiError('Email ou senha incorretos');
      }
    }

    if (endpoint.includes('/auth/register')) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          email: body.email,
          name: body.name
        }
      } as T;
    }

    if (endpoint.includes('/oficinas')) {
      if (method === 'GET' && !endpoint.match(/\/\d+$/)) {
        // GET /oficinas - listar todas
        return [
          { 
            id: 1, 
            nome: 'Oficina Central Motors', 
            endereco: 'Rua das Palmeiras, 123 - Centro', 
            telefone: '(11) 3333-4444',
            especialidades: ['Motor', 'Transmissão', 'Freios']
          },
          { 
            id: 2, 
            nome: 'AutoPeças & Serviços', 
            endereco: 'Av. Paulista, 567 - Bela Vista', 
            telefone: '(11) 5555-6666',
            especialidades: ['Elétrica', 'Ar Condicionado', 'Suspensão']
          },
          { 
            id: 3, 
            nome: 'Moto Repair Pro', 
            endereco: 'Rua da Consolação, 890 - Vila Madalena', 
            telefone: '(11) 7777-8888',
            especialidades: ['Motor', 'Elétrica', 'Carroceria']
          }
        ] as T;
      }
      if (method === 'POST') {
        // POST /oficinas - criar nova
        return { id: Date.now(), ...body } as T;
      }
      if (method === 'PUT') {
        // PUT /oficinas/{id} - atualizar
        return { id: parseInt(endpoint.split('/').pop() || '1'), ...body } as T;
      }
      if (method === 'DELETE') {
        // DELETE /oficinas/{id} - deletar
        return {} as T;
      }
    }

    if (endpoint.includes('/mecanicos')) {
      if (method === 'GET' && !endpoint.match(/\/\d+$/)) {
        // GET /mecanicos - listar todos
        return [
          { id: 1, nome: 'João Silva', especialidade: 'Motor' },
          { id: 2, nome: 'Maria Santos', especialidade: 'Elétrica' },
          { id: 3, nome: 'Pedro Costa', especialidade: 'Suspensão' }
        ] as T;
      }
      if (method === 'POST') {
        // POST /mecanicos - criar novo
        return { id: Date.now(), ...body } as T;
      }
      if (method === 'PUT') {
        // PUT /mecanicos/{id} - atualizar
        return { id: parseInt(endpoint.split('/').pop() || '1'), ...body } as T;
      }
      if (method === 'DELETE') {
        // DELETE /mecanicos/{id} - deletar
        return {} as T;
      }
    }

    if (endpoint.includes('/depositos') || endpoint.includes('/Deposito')) {
      if (method === 'GET' && !endpoint.match(/\/\d+$/)) {
        // GET /depositos - listar todos
        return [
          { id: 1, nome: 'Depósito Matriz', endereco: 'Rua Alfa, 100 - Centro' },
          { id: 2, nome: 'Depósito Secundário', endereco: 'Av. Beta, 200 - Industrial' },
          { id: 3, nome: 'Depósito Leste', endereco: 'Rua Gama, 300 - Jardim' },
        ] as T;
      }
      if (method === 'GET' && endpoint.match(/\/\d+$/)) {
        const id = parseInt(endpoint.split('/').pop() || '1');
        return ({ id, nome: `Depósito ${id}`, endereco: `Endereço ${id}` } as any) as T;
      }
      if (method === 'POST') {
        // POST /depositos - criar novo
        return { id: Date.now(), ...body } as T;
      }
      if (method === 'PUT') {
        // PUT /depositos/{id} - atualizar
        return { id: parseInt(endpoint.split('/').pop() || '1'), ...body } as T;
      }
      if (method === 'DELETE') {
        // DELETE /depositos/{id} - deletar
        return {} as T;
      }
    }

    throw new ApiError('Endpoint não encontrado no modo simulado');
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