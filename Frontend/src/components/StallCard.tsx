import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canEditStall } from '../utils/permissions';
import type { Stall } from '../types';

export function StallCard({ stall }: { stall: Stall }) {
  const { user } = useAuth();

  return (
    <article className="card stall-card">
      <div className="stall-card-head">
        <h2 className="stall-name">
          <Link to={`/stalls/${stall.id}`}>{stall.name}</Link>
        </h2>
        {stall.isPopular && <span className="badge badge-popular">Populer</span>}
      </div>
      {stall.category && <span className="tag">{stall.category}</span>}
      <p className="muted">{stall.location || 'Lokasi belum diisi'}</p>
      <p className="stall-rating">
        ★ {stall.avgRating.toFixed(1)} <span className="muted">({stall.reviewCount} ulasan)</span>
      </p>
      <div className="actions">
        <Link to={`/stalls/${stall.id}`} className="btn btn-outline">
          Lihat detail
        </Link>
        {canEditStall(user, stall) && (
          <Link to={`/stalls/${stall.id}/edit`} className="btn btn-outline">
            Ubah
          </Link>
        )}
      </div>
    </article>
  );
}