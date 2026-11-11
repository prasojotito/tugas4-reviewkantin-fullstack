import axios from 'axios';

const TOKEN_KEY = 'token';
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Setiap request otomatis membawa token JWT bila pengguna sudah login.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 saat token ada: token tidak valid atau kedaluwarsa, sesi diakhiri.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    const isLoginRequest = url.includes('/auth/login');
    if (axios.isAxiosError(error) && error.response?.status === 401 && !isLoginRequest && tokenStorage.get()) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);