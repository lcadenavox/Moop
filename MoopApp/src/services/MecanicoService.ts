import { Mecanico } from '../types';
import ApiService from './ApiService';

export class MecanicoService {
  private static instance: MecanicoService;

  public static getInstance(): MecanicoService {
    if (!MecanicoService.instance) {
      MecanicoService.instance = new MecanicoService();
    }
    return MecanicoService.instance;
  }

  async getAll(): Promise<Mecanico[]> {
    return ApiService.get<Mecanico[]>('/mecanicos');
  }

  async getById(id: number): Promise<Mecanico> {
    return ApiService.get<Mecanico>(`/mecanicos/${id}`);
  }

  async create(mecanico: Omit<Mecanico, 'id'>): Promise<Mecanico> {
    return ApiService.post<Mecanico>('/mecanicos', mecanico);
  }

  async update(id: number, mecanico: Omit<Mecanico, 'id'>): Promise<Mecanico> {
    return ApiService.put<Mecanico>(`/mecanicos/${id}`, mecanico);
  }

  async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`/mecanicos/${id}`);
  }
}

export default MecanicoService.getInstance();