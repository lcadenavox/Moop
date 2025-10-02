import { Oficina, PaginatedResponse } from '../types';
import ApiService from './ApiService';

export class OficinaService {
  private static instance: OficinaService;

  public static getInstance(): OficinaService {
    if (!OficinaService.instance) {
      OficinaService.instance = new OficinaService();
    }
    return OficinaService.instance;
  }

  async getPage(page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Oficina>> {
    const query = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const res = await ApiService.get<any>(`/Oficina${query}`);

    if (Array.isArray(res)) {
      return { data: res, total: res.length, page, pageSize };
    }
    if (res && Array.isArray(res.data)) {
      return res as PaginatedResponse<Oficina>;
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

  async getAll(max: number = 1000): Promise<Oficina[]> {
    const page = await this.getPage(1, max);
    return page.data;
  }

  async getById(id: number): Promise<Oficina> {
    return ApiService.get<Oficina>(`/Oficina/${id}`);
  }

  async create(oficina: Omit<Oficina, 'id'>): Promise<Oficina> {
    return ApiService.post<Oficina>('/Oficina', oficina);
  }

  async update(id: number, oficina: Omit<Oficina, 'id'>): Promise<Oficina> {
    return ApiService.put<Oficina>(`/Oficina/${id}`, oficina);
  }

  async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`/Oficina/${id}`);
  }
}

export default OficinaService.getInstance();