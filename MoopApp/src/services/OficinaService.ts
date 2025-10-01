import { Oficina } from '../types';
import ApiService from './ApiService';

export class OficinaService {
  private static instance: OficinaService;

  public static getInstance(): OficinaService {
    if (!OficinaService.instance) {
      OficinaService.instance = new OficinaService();
    }
    return OficinaService.instance;
  }

  async getAll(): Promise<Oficina[]> {
    return ApiService.get<Oficina[]>('/oficinas');
  }

  async getById(id: number): Promise<Oficina> {
    return ApiService.get<Oficina>(`/oficinas/${id}`);
  }

  async create(oficina: Omit<Oficina, 'id'>): Promise<Oficina> {
    return ApiService.post<Oficina>('/oficinas', oficina);
  }

  async update(id: number, oficina: Omit<Oficina, 'id'>): Promise<Oficina> {
    return ApiService.put<Oficina>(`/oficinas/${id}`, oficina);
  }

  async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`/oficinas/${id}`);
  }
}

export default OficinaService.getInstance();