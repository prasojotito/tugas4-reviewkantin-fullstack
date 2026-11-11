import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { StallForm } from '../components/StallForm';
import { toUpdatePayload, valuesFromStall, type StallFormValues } from '../utils/stallForm';
import type { Stall } from '../types';

export function StallEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<ParsedError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ParsedError | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    stallsApi
      .get(Number(id))
      .then((data) => {
        if (!cancelled) setStall(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(parseApiError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values: StallFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const updated = await stallsApi.update(Number(id), toUpdatePayload(values));
      navigate(`/stalls/${updated.id}`, { state: { message: 'Perubahan warung berhasil disimpan.' } });
    } catch (err) {
      setSubmitError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" aria-hidden="true" />
        <p className="muted">Memuat data warung...</p>
      </div>
    );
  }

  if (loadError || !stall) {
    return (
      <section className="auth-page stall-editor-page" aria-label="Gagal memuat data warung">
        <div className="alert alert-error">
          <strong>{loadError?.status === 404 ? 'Warung tidak ditemukan.' : 'Gagal memuat data.'}</strong>{' '}
          {loadError?.message}
        </div>
        <Link to="/" className="auth-back">
          ← Kembali ke daftar warung
        </Link>
      </section>
    );
  }

  return (
    <section className="auth-page stall-editor-page" aria-labelledby="edit-stall-title">
      <article className="auth-card">
        <aside className="auth-aside auth-stall-aside">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark" aria-hidden="true">
              🍴
            </span>
            <span>Review Kantin</span>
          </Link>
          <div className="auth-aside-copy">
            <span className="auth-aside-kicker">Ruang pengelola</span>
            <h2>Informasi warung selalu terkini.</h2>
            <p>Perbarui detail agar pengunjung mendapatkan informasi yang tepat.</p>
          </div>
          <div className="auth-food-art" aria-hidden="true">
            <span className="auth-food auth-food-main">🏪</span>
            <span className="auth-food auth-food-small auth-food-top">🍛</span>
            <span className="auth-food auth-food-small auth-food-bottom">✦</span>
          </div>
        </aside>

        <div className="auth-content auth-stall-content">
          <div className="auth-heading">
            <span className="auth-eyebrow">Perbarui informasi</span>
            <h1 id="edit-stall-title">Ubah warung</h1>
            <p>Sunting detail warung dan simpan perubahan yang diperlukan.</p>
          </div>

          <StallForm
            key={stall.id}
            initialValues={valuesFromStall(stall)}
            submitLabel="Simpan perubahan"
            submitting={submitting}
            error={submitError}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/stalls/${stall.id}`)}
          />

          <Link to={`/stalls/${stall.id}`} className="auth-back">
            ← Kembali ke detail warung
          </Link>
        </div>
      </article>
    </section>
  );
}