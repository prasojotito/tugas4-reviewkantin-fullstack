import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { StallCard } from '../components/StallCard';
import { StallCardSkeleton } from '../components/StallCardSkeleton';
import { CategoryTiles } from '../components/CategoryTiles';
import { Pagination } from '../components/Pagination';
import { canCreateStall } from '../utils/permissions';
import type { Pagination as PaginationMeta, Stall } from '../types';

const PAGE_SIZE = 8;

export function HomePage() {
  const { user } = useAuth();
  const location = useLocation();
  const flash = (location.state as { message?: string } | null)?.message;

  // Pencarian, kategori, dan halaman disimpan di URL.
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const category = params.get('kategori') ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ParsedError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Seluruh warung (maks. 100) dipakai untuk tile kategori dan baris "Warung Populer".
  const [everyStall, setEveryStall] = useState<Stall[]>([]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    stallsApi
      .list({ limit: 100 })
      .then(({ data }) => setEveryStall(data))
      .catch(() => {
        /* bagian pelengkap, kegagalannya tidak perlu ditampilkan */
      });
  }, [reloadKey]);

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

  const categories = Array.from(
    new Set(everyStall.map((s) => s.category).filter((c): c is string => Boolean(c))),
  ).sort();
  const popular = everyStall.filter((s) => s.isPopular);

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
    });
    setParams(next);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    update({ q: searchInput.trim(), page: null });
  };

  const handleCategory = (value: string) => update({ kategori: value, page: null });

  const handlePage = (p: number) => {
    update({ page: p === 1 ? null : String(p) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSearchInput('');
    setParams(new URLSearchParams());
  };

  const isFiltering = search !== '' || category !== '';
  const showPopular = !isFiltering && page === 1 && popular.length > 0;

  return (
    <div>
      <section className="hero">
        <h1>Mau makan apa di kantin hari ini?</h1>
        <p>Temukan warung favorit, lihat rating, dan baca ulasan dari mahasiswa lain.</p>
        <form className="hero-search" onSubmit={handleSearch} role="search">
          <input
            type="search"
            placeholder="Cari nama warung..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Cari warung"
          />
          <button type="submit" className="btn btn-primary">
            Cari
          </button>
        </form>
      </section>

      {flash && <div className="alert alert-success">{flash}</div>}

      <CategoryTiles categories={categories} active={category} onSelect={handleCategory} />

      {showPopular && (
        <section className="section">
          <div className="section-head">
            <h2>Warung Populer</h2>
          </div>
          <div className="h-scroll">
            {popular.map((s) => (
              <StallCard key={s.id} stall={s} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2>
            {isFiltering ? 'Hasil pencarian' : 'Semua Warung'}
            {meta && !loading && <span className="muted count"> · {meta.total} warung</span>}
          </h2>
          {canCreateStall(user) && (
            <Link to="/stalls/new" className="btn btn-primary btn-sm">
              + Tambah Warung
            </Link>
          )}
        </div>

        {isFiltering && (
          <p className="filter-info muted">
            {search && (
              <>
                Kata kunci: <strong>“{search}”</strong>{' '}
              </>
            )}
            {category && (
              <>
                Kategori: <strong>{category}</strong>{' '}
              </>
            )}
            <button type="button" className="link-btn" onClick={handleReset}>
              Hapus filter
            </button>
          </p>
        )}

        {loading && (
          <>
            <p className="sr-only" role="status">
              Memuat daftar warung...
            </p>
            <div className="stall-grid">
              {Array.from({ length: PAGE_SIZE }, (_, i) => (
                <StallCardSkeleton key={i} />
              ))}
            </div>
          </>
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
            <div className="state-emoji" aria-hidden="true">
              🔍
            </div>
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
            {meta && <Pagination meta={meta} onPageChange={handlePage} />}
          </>
        )}
      </section>
    </div>
  );
}