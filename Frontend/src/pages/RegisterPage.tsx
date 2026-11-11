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
    <div className="card form-card">
      <h1>Registrasi</h1>
      {error && <div className="alert alert-error">{error.message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Nama</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          {error?.fieldErrors.name && <span className="field-error">{error.fieldErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {error?.fieldErrors.email && <span className="field-error">{error.fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {error?.fieldErrors.password && (
            <span className="field-error">{error.fieldErrors.password}</span>
          )}
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="muted">
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}