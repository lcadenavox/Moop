export interface Moto {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
}

export interface Mecanico {
  id: number;
  nome: string;
  especialidade: string;
}

export interface Deposito {
  id: number;
  nome: string;
  endereco: string;
}

export interface Oficina {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  especialidades: string[];
}

export interface User {
  id?: number;
  email: string;
  password?: string;
  name?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}