import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canEditStall } from '../utils/permissions';
import { categoryEmoji, stallGradient } from '../utils/stallVisual';
import type { Stall } from '../types';

export function StallCard({ stall }: { stall: Stall }) {
  const { user } = useAuth();

  return (
    <article className="stall-card">
      <Link
        to={`/stalls/${stall.id}`}
        className="stall-media"
        style={{ background: stallGradient(stall.id) }}
        aria-label={`Lihat detail ${stall.name}`}
      >
        {stall.isPopular && <span className="chip chip-popular">Populer</span>}
        <span className="stall-emoji" aria-hidden="true">
          {categoryEmoji(stall.category)}
        </span>
      </Link>

      <div className="stall-body">
        <h3 className="stall-name">
          <Link to={`/stalls/${stall.id}`}>{stall.name}</Link>
        </h3>
        <p className="stall-meta">
          {[stall.category, stall.location].filter(Boolean).join(' · ') || 'Lokasi belum diisi'}
        </p>
        <div className="stall-foot">
          <span className={stall.reviewCount > 0 ? 'rating' : 'rating rating-none'}>
            {stall.reviewCount > 0 ? `★ ${stall.avgRating.toFixed(1)}` : 'Belum ada rating'}
            {stall.reviewCount > 0 && (
              <span className="muted"> · {stall.reviewCount} ulasan</span>
            )}
          </span>
          {canEditStall(user, stall) ? (
            <Link to={`/stalls/${stall.id}/edit`} className="link-small">
              Ubah
            </Link>
          ) : (
            <Link to={`/stalls/${stall.id}`} className="link-small">
              Lihat detail
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
