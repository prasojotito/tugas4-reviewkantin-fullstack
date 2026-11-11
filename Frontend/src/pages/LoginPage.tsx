import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { parseApiError, type ParsedError } from '../api/errors';

interface LocationState {
  from?: string;
  message?: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ParsedError | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate(state.from ?? '/', { replace: true });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page" aria-labelledby="login-title">
      <div className="auth-card">
        <aside className="auth-aside">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark" aria-hidden="true">
              🍴
            </span>
            <span>Review Kantin</span>
          </Link>
          <div className="auth-aside-copy">
            <span className="auth-aside-kicker">Senang melihatmu kembali</span>
            <h2>Rasa favoritmu selalu dekat.</h2>
            <p>Masuk untuk mengelola warung dan melanjutkan cerita kulinermu di kampus.</p>
          </div>
          <div className="auth-food-art" aria-hidden="true">
            <span className="auth-food auth-food-main">🍛</span>
            <span className="auth-food auth-food-small auth-food-top">🥟</span>
            <span className="auth-food auth-food-small auth-food-bottom">☕</span>
          </div>
        </aside>

        <div className="auth-content">
          <div className="auth-heading">
            <span className="auth-eyebrow">Selamat datang kembali</span>
            <h1 id="login-title">Masuk ke akunmu</h1>
            <p>Gunakan email dan password yang terdaftar untuk melanjutkan.</p>
          </div>

          {state.message && (
            <div className="alert alert-info" role="status">
              {state.message}
            </div>
          )}
          {error && (
            <div className="alert alert-error" role="alert">
              {error.message}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-invalid={Boolean(error?.fieldErrors.password)}
                aria-describedby={error?.fieldErrors.password ? 'password-error' : undefined}
              />
              {error?.fieldErrors.password && (
                <span id="password-error" className="field-error">
                  {error.fieldErrors.password}
                </span>
              )}
            </div>

            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Memeriksa akun...' : 'Masuk'}
              {!submitting && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="auth-switch">
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>
          <Link to="/" className="auth-back">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
