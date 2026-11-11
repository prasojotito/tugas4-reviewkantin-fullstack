import { useEffect, useState, type FormEvent } from 'react';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { StallCard } from '../components/StallCard';
import { Pagination } from '../components/Pagination';
import type { Pagination as PaginationMeta, Stall } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canCreateStall } from '../utils/permissions';

const PAGE_SIZE = 6;

export function HomePage() {
  const { user } = useAuth();
  const location = useLocation();
  const flash = (location.state as { message?: string } | null)?.message;
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ParsedError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Daftar kategori untuk filter diambil dari data backend.
  useEffect(() => {
    stallsApi
      .list({ limit: 100 })
      .then(({ data }) => {
        const unique = new Set<string>();
        data.forEach((s) => {
          if (s.category) unique.add(s.category);
        });
        setCategories(Array.from(unique).sort());
      })
      .catch(() => {
        /* filter kategori opsional, kegagalannya tidak perlu ditampilkan */
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    stallsApi
      .list({
        search: search || undefined,
        category: category || undefined,
        page,
        limit: PAGE_SIZE,
      })
      .then((res) => {
        if (cancelled) return;
        setStalls(res.data);
        setMeta(res.meta);
      })
      .catch((err) => {
        if (!cancelled) setError(parseApiError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, category, page, reloadKey]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleCategory = (value: string) => {
    setPage(1);
    setCategory(value);
  };

  const handleReset = () => {
    setSearchInput('');
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const isFiltering = search !== '' || category !== '';

  return (
    <div>
            <div className="page-head">
        <h1>Daftar Warung</h1>
        {canCreateStall(user) && (
          <Link to="/stalls/new" className="btn btn-primary">
            + Tambah Warung
          </Link>
        )}
      </div>
      {flash && <div className="alert alert-success">{flash}</div>}

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Cari nama warung..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Cari warung"
        />
        <select
          value={category}
          onChange={(e) => handleCategory(e.target.value)}
          aria-label="Filter kategori"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Cari
        </button>
        {isFiltering && (
          <button type="button" className="btn btn-outline" onClick={handleReset}>
            Reset
          </button>
        )}
      </form>

      {loading && (
        <div className="state-box">
          <div className="spinner" aria-hidden="true" />
          <p className="muted">Memuat daftar warung...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error">
          <p>
            <strong>Gagal memuat data.</strong> {error.message}
          </p>
          <button type="button" className="btn btn-outline" onClick={() => setReloadKey((k) => k + 1)}>
            Coba lagi
          </button>
        </div>
      )}

      {!loading && !error && stalls.length === 0 && (
        <div className="state-box">
          <p>
            {isFiltering
              ? 'Tidak ada warung yang cocok dengan pencarian atau filter Anda.'
              : 'Belum ada data warung.'}
          </p>
          {isFiltering && (
            <button type="button" className="btn btn-outline" onClick={handleReset}>
              Hapus filter
            </button>
          )}
        </div>
      )}

      {!loading && !error && stalls.length > 0 && (
        <>
          <div className="stall-grid">
            {stalls.map((s) => (
              <StallCard key={s.id} stall={s} />
            ))}
          </div>
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}