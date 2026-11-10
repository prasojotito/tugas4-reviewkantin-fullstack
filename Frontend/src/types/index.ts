export type Role = 'admin' | 'owner' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

// Bentuk error dari backend (Tugas 3)
export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  status: 'fail' | 'error';
  message: string;
  errors?: FieldError[];
}

// Bentuk respons sukses dari backend
export interface ApiResponse<T> {
  status: 'success';
  data: T;
}

export interface ListResponse<T> {
  status: 'success';
  data: T[];
  meta: Pagination;
}