import { Moto, PaginatedResponse } from '../types';
import ApiService from './ApiService';

export class MotoService {
  private static instance: MotoService;

  public static getInstance(): MotoService {
    if (!MotoService.instance) {
      MotoService.instance = new MotoService();
    }
    return MotoService.instance;
  }

  async getPage(page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Moto>> {
    const query = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const res = await ApiService.get<any>(`/Moto${query}`);

    if (Array.isArray(res)) {
      return { data: res, total: res.length, page, pageSize };
    }
    if (res && Array.isArray(res.data)) {
      return res as PaginatedResponse<Moto>;
    }
    if (res && Array.isArray(res.items)) {
      return {
        data: res.items,
        total: typeof res.total === 'number' ? res.total : res.items.length,
        page: typeof res.page === 'number' ? res.page : page,
        pageSize: typeof res.pageSize === 'number' ? res.pageSize : pageSize,
      };
    }
    return { data: [], total: 0, page, pageSize };
  }

  async getAll(max: number = 1000): Promise<Moto[]> {
    const page = await this.getPage(1, max);
    return page.data;
  }

  async getById(id: number): Promise<Moto> {
    return ApiService.get<Moto>(`/Moto/${id}`);
  }

  async create(moto: Omit<Moto, 'id'>): Promise<Moto> {
    return ApiService.post<Moto>('/Moto', moto);
  }

  async update(id: number, moto: Omit<Moto, 'id'>): Promise<Moto> {
    return ApiService.put<Moto>(`/Moto/${id}`, moto);
  }

  async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`/Moto/${id}`);
  }
}

export default MotoService.getInstance();