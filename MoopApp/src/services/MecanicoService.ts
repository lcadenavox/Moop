import { Mecanico, PaginatedResponse } from '../types';
import ApiService from './ApiService';

export class MecanicoService {
  private static instance: MecanicoService;

  public static getInstance(): MecanicoService {
    if (!MecanicoService.instance) {
      MecanicoService.instance = new MecanicoService();
    }
    return MecanicoService.instance;
  }

  async getPage(page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Mecanico>> {
    const query = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const res = await ApiService.get<any>(`/Mecanico${query}`);

    if (Array.isArray(res)) {
      return { data: res, total: res.length, page, pageSize };
    }
    if (res && Array.isArray(res.data)) {
      return res as PaginatedResponse<Mecanico>;
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

  async getAll(max: number = 1000): Promise<Mecanico[]> {
    const page = await this.getPage(1, max);
    return page.data;
  }

  async getById(id: number): Promise<Mecanico> {
    return ApiService.get<Mecanico>(`/Mecanico/${id}`);
  }

  async create(mecanico: Omit<Mecanico, 'id'>): Promise<Mecanico> {
    return ApiService.post<Mecanico>('/Mecanico', mecanico);
  }

  async update(id: number, mecanico: Omit<Mecanico, 'id'>): Promise<Mecanico> {
    return ApiService.put<Mecanico>(`/Mecanico/${id}`, mecanico);
  }

  async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`/Mecanico/${id}`);
  }
}

export default MecanicoService.getInstance();