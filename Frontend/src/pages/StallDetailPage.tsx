import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { canDeleteStall, canEditStall } from '../utils/permissions';
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
        <div className="state-box">
          <div className="spinner" aria-hidden="true" />
          <p className="muted">Memuat detail warung...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error">
          <p>
            <strong>{error.status === 404 ? 'Warung tidak ditemukan.' : 'Gagal memuat detail.'}</strong>{' '}
            {error.message}
          </p>
          {error.status !== 404 && (
            <button type="button" className="btn btn-outline" onClick={() => setReloadKey((k) => k + 1)}>
              Coba lagi
            </button>
          )}
        </div>
      )}

      {!loading && !error && stall && (
        <article className="card detail-card">
          <div className="stall-card-head">
            <h1>{stall.name}</h1>
            {stall.isPopular && <span className="badge badge-popular">Populer</span>}
          </div>
          {stall.category && <span className="tag">{stall.category}</span>}
          <dl className="detail-list">
            <dt>Lokasi</dt>
            <dd>{stall.location || '-'}</dd>
            <dt>Rating</dt>
            <dd>
              ★ {stall.avgRating.toFixed(1)} ({stall.reviewCount} ulasan)
            </dd>
            <dt>Deskripsi</dt>
            <dd>{stall.description || 'Belum ada deskripsi.'}</dd>
          </dl>

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
        </article>
      )}
    </div>
  );
}