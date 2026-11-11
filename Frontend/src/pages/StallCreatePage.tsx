import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { StallForm } from '../components/StallForm';
import { emptyStallValues, toCreatePayload, type StallFormValues } from '../utils/stallForm';

export function StallCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ParsedError | null>(null);

  const handleSubmit = async (values: StallFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const stall = await stallsApi.create(toCreatePayload(values));
      navigate(`/stalls/${stall.id}`, { state: { message: 'Warung berhasil ditambahkan.' } });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page stall-editor-page" aria-labelledby="create-stall-title">
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
            <h2>Kenalkan warung andalan kampus.</h2>
            <p>Lengkapi informasi warung agar pengunjung mudah menemukan dan mengenalinya.</p>
          </div>
          <div className="auth-food-art" aria-hidden="true">
            <span className="auth-food auth-food-main">🏪</span>
            <span className="auth-food auth-food-small auth-food-top">🍜</span>
            <span className="auth-food auth-food-small auth-food-bottom">✨</span>
          </div>
        </aside>

        <div className="auth-content auth-stall-content">
          <div className="auth-heading">
            <span className="auth-eyebrow">Informasi warung</span>
            <h1 id="create-stall-title">Tambah warung</h1>
            <p>Isi detail berikut untuk menambahkan warung ke daftar kantin.</p>
          </div>

          <StallForm
            initialValues={emptyStallValues}
            submitLabel="Simpan warung"
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
          />

          <Link to="/" className="auth-back">
            ← Kembali ke beranda
          </Link>
        </div>
      </article>
    </section>
  );
}