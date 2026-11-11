import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { parseApiError, type ParsedError } from '../api/errors';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ParsedError | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await authApi.register({ name, email, password });
      navigate('/login', { state: { message: 'Registrasi berhasil. Silakan login.' } });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page" aria-labelledby="register-title">
      <div className="auth-card">
        <aside className="auth-aside auth-aside-register">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark" aria-hidden="true">
              🍴
            </span>
            <span>Review Kantin</span>
          </Link>
          <div className="auth-aside-copy">
            <span className="auth-aside-kicker">Jelajahi rasa lokal</span>
            <h2>Satu akun, banyak cerita rasa.</h2>
            <p>Bergabunglah dengan komunitas yang saling berbagi rekomendasi warung kampus.</p>
          </div>
          <div className="auth-food-art" aria-hidden="true">
            <span className="auth-food auth-food-main">🍜</span>
            <span className="auth-food auth-food-small auth-food-top">🥐</span>
            <span className="auth-food auth-food-small auth-food-bottom">🥤</span>
          </div>
        </aside>

        <div className="auth-content">
          <div className="auth-heading">
            <span className="auth-eyebrow">Mulai perjalanan kulinermu</span>
            <h1 id="register-title">Buat akun baru</h1>
            <p>Daftar untuk menemukan dan berbagi warung favorit di kampus.</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              {error.message}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Nama lengkap</label>
              <input
                id="name"
                placeholder="Contoh: Nadia Putri"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(error?.fieldErrors.name)}
                aria-describedby={error?.fieldErrors.name ? 'name-error' : undefined}
              />
              {error?.fieldErrors.name && (
                <span id="name-error" className="field-error">
                  {error.fieldErrors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Alamat email</label>
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={Boolean(error?.fieldErrors.email)}
                aria-describedby={error?.fieldErrors.email ? 'email-error' : undefined}
              />
              {error?.fieldErrors.email && (
                <span id="email-error" className="field-error">
                  {error.fieldErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                aria-invalid={Boolean(error?.fieldErrors.password)}
                aria-describedby={error?.fieldErrors.password ? 'password-error' : undefined}
              />
              {error?.fieldErrors.password && (
                <span id="password-error" className="field-error">
                  {error.fieldErrors.password}
                </span>
              )}
              <span className="auth-field-hint">Gunakan minimal 8 karakter untuk password.</span>
            </div>

            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Membuat akun...' : 'Buat akun'}
              {!submitting && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="auth-switch">
            Sudah punya akun? <Link to="/login">Masuk</Link>
          </p>
          <Link to="/" className="auth-back">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
