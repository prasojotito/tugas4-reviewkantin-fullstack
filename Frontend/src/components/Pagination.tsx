import type { Pagination as PaginationMeta } from '../types';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ meta, onPageChange, disabled }: Props) {
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-outline"
        disabled={disabled || meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Sebelumnya
      </button>
      <span className="muted">
        Halaman {meta.page} dari {totalPages} · {meta.total} warung
      </span>
      <button
        type="button"
        className="btn btn-outline"
        disabled={disabled || meta.page >= totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Selanjutnya
      </button>
    </nav>
  );
}