import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { useAuth } from '../context/AuthContext';
import { canDeleteStall, canEditStall } from '../utils/permissions';
import { categoryEmoji, stallGradient } from '../utils/stallVisual';
import type { Review, Stall } from '../types';

export function StallDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const flash = (location.state as { message?: string } | null)?.message;

  const [stallState, setStallState] = useState<{
    key: string;
    status: 'success' | 'error';
    stall: Stall | null;
    error: ParsedError | null;
  } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<ParsedError | null>(null);
  const [reviewState, setReviewState] = useState<{
    stallId: string;
    requestKey: number;
    status: 'success' | 'error';
    data: Review[];
    error: ParsedError | null;
  } | null>(null);
  const [reviewsReloadKey, setReviewsReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    stallsApi
      .get(Number(id))
      .then((data) => {
        if (!cancelled) {
          setStallState({
            key: `${id ?? ''}:${reloadKey}`,
            status: 'success',
            stall: data,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStallState({
            key: `${id ?? ''}:${reloadKey}`,
            status: 'error',
            stall: null,
            error: parseApiError(err),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  const stallLoading = stallState?.key !== `${id ?? ''}:${reloadKey}`;
  const error = stallLoading || stallState?.status !== 'error' ? null : stallState.error;
  const stall = stallLoading || stallState?.status !== 'success' ? null : stallState.stall;

  useEffect(() => {
    let cancelled = false;

    stallsApi
      .reviews(Number(id))
      .then((data) => {
        if (!cancelled) {
          setReviewState({
            stallId: id ?? '',
            requestKey: reviewsReloadKey,
            status: 'success',
            data,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setReviewState({
            stallId: id ?? '',
            requestKey: reviewsReloadKey,
            status: 'error',
            data: [],
            error: parseApiError(err),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, reviewsReloadKey]);

  const reviewsLoading =
    reviewState?.stallId !== (id ?? '') || reviewState?.requestKey !== reviewsReloadKey;
  const reviewsError = reviewsLoading || reviewState?.status !== 'error' ? null : reviewState.error;
  const reviews = reviewsLoading || reviewState?.status !== 'success' ? [] : reviewState.data;

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

      {stallLoading && (
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

      {!stallLoading && error?.status === 404 && (
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

      {!stallLoading && error && error.status !== 404 && (
        <div className="alert alert-error">
          <p>
            <strong>Gagal memuat detail.</strong> {error.message}
          </p>
          <button type="button" className="btn btn-outline" onClick={() => setReloadKey((k) => k + 1)}>
            Coba lagi
          </button>
        </div>
      )}

      {!stallLoading && !error && stall && (
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

            <section className="reviews-section" aria-labelledby="reviews-title">
              <div className="reviews-heading">
                <div>
                  <h2 id="reviews-title">Ulasan pelanggan</h2>
                  <p className="muted">
                    {stall.reviewCount} ulasan
                    {stall.reviewCount > 0 && ` · Rating ${stall.avgRating.toFixed(1)} dari 5`}
                  </p>
                </div>
              </div>

              {reviewsLoading && (
                <p className="muted" role="status">
                  Memuat ulasan...
                </p>
              )}

              {!reviewsLoading && reviewsError && (
                <div className="alert alert-error">
                  <p>Ulasan gagal dimuat. {reviewsError.message}</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setReviewsReloadKey((key) => key + 1)}
                  >
                    Coba lagi
                  </button>
                </div>
              )}

              {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                <p className="reviews-empty">Belum ada ulasan untuk warung ini.</p>
              )}

              {!reviewsLoading && !reviewsError && reviews.length > 0 && (
                <div className="review-list">
                  {reviews.map((review) => (
                    <article className="review-item" key={review.id}>
                      <div className="review-avatar" aria-hidden="true">
                        {review.user.name.trim().charAt(0).toUpperCase()}
                      </div>
                      <div className="review-content">
                        <div className="review-topline">
                          <strong>{review.user.name}</strong>
                          <span className="review-rating" aria-label={`Rating ${review.rating} dari 5`}>
                            {'★'.repeat(review.rating)}
                            <span className="review-rating-empty">{'★'.repeat(5 - review.rating)}</span>
                            <span className="review-rating-number"> {review.rating}</span>
                          </span>
                        </div>
                        {review.comment ? (
                          <p className="review-comment">{review.comment}</p>
                        ) : (
                          <p className="review-comment muted">Tidak ada komentar.</p>
                        )}
                        <div className="review-meta">
                          {review.createdAt && (
                            <time dateTime={review.createdAt}>
                              {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </time>
                          )}
                          {review.likeCount > 0 && <span>♥ {review.likeCount}</span>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

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