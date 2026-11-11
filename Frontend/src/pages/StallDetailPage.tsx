import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { canDeleteStall, canEditStall } from '../utils/permissions';
import { categoryEmoji, stallGradient } from '../utils/stallVisual';
import type { Stall } from '../types';

export function StallDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const flash = (location.state as { message?: string } | null)?.message;

  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ParsedError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<ParsedError | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    stallsApi
      .get(Number(id))
      .then((data) => {
        if (!cancelled) setStall(data);
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
  }, [id, reloadKey]);

  const handleDelete = async () => {
    if (!stall) return;
    if (!window.confirm(`Hapus warung "${stall.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      await stallsApi.remove(stall.id);
      navigate('/', { state: { message: `Warung "${stall.name}" berhasil dihapus.` } });
    } catch (err) {
      setDeleteError(parseApiError(err));
      setDeleting(false);
    }
  };

  return (
    <div>
      <p>
        <Link to="/">← Kembali ke daftar warung</Link>
      </p>

      {flash && <div className="alert alert-success">{flash}</div>}
      {deleteError && (
        <div className="alert alert-error">
          <strong>Gagal menghapus.</strong> {deleteError.message}
        </div>
      )}

      {loading && (
        <>
          <p className="sr-only" role="status">
            Memuat detail warung...
          </p>
          <div className="detail" aria-hidden="true">
            <div className="detail-media skeleton" />
            <div className="detail-body">
              <div className="skeleton line tall w70" />
              <div className="skeleton line w40" />
              <div className="skeleton line w90" />
              <div className="skeleton line w90" />
            </div>
          </div>
        </>
      )}

      {!loading && error?.status === 404 && (
        <div className="state-box">
          <div className="state-emoji" aria-hidden="true">
            😕
          </div>
          <p>
            <strong>Warung tidak ditemukan.</strong>
          </p>
          <Link to="/" className="btn btn-outline">
            Lihat semua warung
          </Link>
        </div>
      )}

      {!loading && error && error.status !== 404 && (
        <div className="alert alert-error">
          <p>
            <strong>Gagal memuat detail.</strong> {error.message}
          </p>
          <button type="button" className="btn btn-outline" onClick={() => setReloadKey((k) => k + 1)}>
            Coba lagi
          </button>
        </div>
      )}

      {!loading && !error && stall && (
        <article className="detail">
          <div className="detail-media" style={{ background: stallGradient(stall.id) }}>
            <span className="detail-emoji" aria-hidden="true">
              {categoryEmoji(stall.category)}
            </span>
          </div>

          <div className="detail-body">
            <div className="detail-title">
              <h1>{stall.name}</h1>
              {stall.isPopular && <span className="chip chip-popular">🔥 Populer</span>}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Lokasi</span>
                <span>📍 {stall.location || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Kategori</span>
                <span>{stall.category || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rating</span>
                <span>{stall.reviewCount > 0 ? `★ ${stall.avgRating.toFixed(1)}` : 'Belum ada rating'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ulasan</span>
                <span>{stall.reviewCount}</span>
              </div>
            </div>

            <div className="detail-desc">
              <h2>Tentang warung</h2>
              <p>{stall.description || 'Belum ada deskripsi.'}</p>
            </div>

            {(canEditStall(user, stall) || canDeleteStall(user)) && (
              <div className="actions">
                {canEditStall(user, stall) && (
                  <Link to={`/stalls/${stall.id}/edit`} className="btn btn-primary">
                    Ubah
                  </Link>
                )}
                {canDeleteStall(user) && (
                  <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Menghapus...' : 'Hapus'}
                  </button>
                )}
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  );
}