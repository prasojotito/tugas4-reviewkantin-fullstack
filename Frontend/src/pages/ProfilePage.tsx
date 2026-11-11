import { useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import { parseApiError, type ParsedError } from '../api/errors';
import type { User } from '../types';

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ParsedError | null>(null);

  useEffect(() => {
    authApi
      .me()
      .then(setUser)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Memuat profil...</p>;
  if (error) return <div className="alert alert-error">{error.message}</div>;
  if (!user) return null;

  return (
    <div className="card form-card">
      <h1>Profil Saya</h1>
      <p>
        <strong>Nama:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}