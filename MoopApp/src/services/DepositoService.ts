import { Deposito, PaginatedResponse } from '../types';
import ApiService from './ApiService';

export class DepositoService {
  private static instance: DepositoService;

  public static getInstance(): DepositoService {
    if (!DepositoService.instance) {
      DepositoService.instance = new DepositoService();
    }
    return DepositoService.instance;
  }

  async getPage(page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Deposito>> {
    const query = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const res = await ApiService.get<any>(`/Deposito${query}`);

    // Normalize various possible backend shapes into PaginatedResponse
    if (Array.isArray(res)) {
      return { data: res, total: res.length, page, pageSize };
    }
    if (res && Array.isArray(res.data)) {
      return res as PaginatedResponse<Deposito>;
    }
    if (res && Array.isArray(res.items)) {
      return {
        data: res.items,
        total: typeof res.total === 'number' ? res.total : res.items.length,
        page: typeof res.page === 'number' ? res.page : page,
        pageSize: typeof res.pageSize === 'number' ? res.pageSize : pageSize,
      };
    }
    // Fallback: treat unknown shape as empty
    return { data: [], total: 0, page, pageSize };
  }

  async getAll(max: number = 1000): Promise<Deposito[]> {
    // Fetch a large page to approximate "all" without multiple requests
    const page = await this.getPage(1, max);
    return page.data;
  }

  async getById(id: number): Promise<Deposito> {
    return ApiService.get<Deposito>(`/Deposito/${id}`);
  }

  async create(deposito: Omit<Deposito, 'id'>): Promise<Deposito> {
    return ApiService.post<Deposito>('/Deposito', deposito);
  }

  async update(id: number, deposito: Omit<Deposito, 'id'>): Promise<Deposito> {
    return ApiService.put<Deposito>(`/Deposito/${id}`, deposito);
  }

  async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`/Deposito/${id}`);
  }

  async getCount(): Promise<number> {
    try {
      const page = await this.getPage(1, 1);
      return page.total ?? page.data.length;
    } catch {
      const list = await this.getAll(100);
      return list.length;
    }
  }
}

export default DepositoService.getInstance();