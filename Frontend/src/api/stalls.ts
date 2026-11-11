import { api } from './client';
import type { ApiResponse, ListResponse, Pagination, Stall } from '../types';

export interface StallQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface StallPayload {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}

export const stallsApi = {
  list: async (query: StallQuery = {}): Promise<{ data: Stall[]; meta: Pagination }> => {
    const res = await api.get<ListResponse<Stall>>('/stalls', { params: query });
    return { data: res.data.data, meta: res.data.meta };
  },

  get: async (id: number): Promise<Stall> => {
    const res = await api.get<ApiResponse<Stall>>(`/stalls/${id}`);
    return res.data.data;
  },

  create: async (payload: StallPayload): Promise<Stall> => {
    const res = await api.post<ApiResponse<Stall>>('/stalls', payload);
    return res.data.data;
  },

  update: async (id: number, payload: Partial<StallPayload>): Promise<Stall> => {
    const res = await api.put<ApiResponse<Stall>>(`/stalls/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<Stall> => {
    const res = await api.delete<ApiResponse<Stall>>(`/stalls/${id}`);
    return res.data.data;
  },
};