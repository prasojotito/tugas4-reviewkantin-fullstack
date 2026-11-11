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
      <div>
        <div className="alert alert-error">
          <strong>{loadError?.status === 404 ? 'Warung tidak ditemukan.' : 'Gagal memuat data.'}</strong>{' '}
          {loadError?.message}
        </div>
        <Link to="/">← Kembali ke daftar warung</Link>
      </div>
    );
  }

  return (
    <div className="card form-card form-wide">
      <h1>Ubah Warung</h1>
      <StallForm
        key={stall.id}
        initialValues={valuesFromStall(stall)}
        submitLabel="Simpan perubahan"
        submitting={submitting}
        error={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/stalls/${stall.id}`)}
      />
    </div>
  );
}