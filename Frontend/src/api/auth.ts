import { api } from './client';
import type { ApiResponse, User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<User> => {
    const res = await api.post<ApiResponse<User>>('/auth/register', payload);
    return res.data.data;
  },

  login: async (payload: LoginPayload): Promise<LoginResult> => {
    const res = await api.post<ApiResponse<LoginResult>>('/auth/login', payload);
    return res.data.data;
  },

  me: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};