import axios from 'axios';
import type { ApiErrorBody } from '../types';

export interface ParsedError {
  status: number | null; // kode HTTP; null bila tidak ada respons (jaringan putus)
  message: string;
  fieldErrors: Record<string, string>; // pesan per field untuk form (error validasi 400)
}

export function parseApiError(error: unknown): ParsedError {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (error.response) {
      const { status, data } = error.response;
      const fieldErrors: Record<string, string> = {};
      data?.errors?.forEach((e) => {
        if (!(e.field in fieldErrors)) fieldErrors[e.field] = e.message;
      });
      return {
        status,
        message: data?.message ?? `Permintaan gagal (kode ${status})`,
        fieldErrors,
      };
    }
    if (error.code === 'ECONNABORTED') {
      return { status: null, message: 'Server terlalu lama merespons. Coba lagi.', fieldErrors: {} };
    }
    return {
      status: null,
      message: 'Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.',
      fieldErrors: {},
    };
  }
  return { status: null, message: 'Terjadi kesalahan yang tidak terduga.', fieldErrors: {} };
}