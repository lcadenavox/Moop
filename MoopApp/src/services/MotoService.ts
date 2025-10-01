import { Moto } from '../types';
import ApiService from './ApiService';

export class MotoService {
  private static instance: MotoService;

  public static getInstance(): MotoService {
    if (!MotoService.instance) {
      MotoService.instance = new MotoService();
    }
    return MotoService.instance;
  }

  async getAll(): Promise<Moto[]> {
    return ApiService.get<Moto[]>('/motos');
  }

  async getById(id: number): Promise<Moto> {
    return ApiService.get<Moto>(`/motos/${id}`);
  }

  async create(moto: Omit<Moto, 'id'>): Promise<Moto> {
    return ApiService.post<Moto>('/motos', moto);
  }

  async update(id: number, moto: Omit<Moto, 'id'>): Promise<Moto> {
    return ApiService.put<Moto>(`/motos/${id}`, moto);
  }

  async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`/motos/${id}`);
  }
}

export default MotoService.getInstance();