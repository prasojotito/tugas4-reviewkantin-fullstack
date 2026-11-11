import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface Props {
  children: ReactNode;
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="muted">Memeriksa sesi login...</p>;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: 'Silakan login terlebih dahulu untuk mengakses halaman ini.',
        }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <section className="access-denied-page" aria-labelledby="access-denied-title">
        <div className="access-denied-card" role="alert">
          <div className="access-denied-icon" aria-hidden="true">
            🔒
          </div>
          <span className="auth-eyebrow">Akses terbatas</span>
          <h1 id="access-denied-title">Kamu belum punya akses</h1>
          <p>
            Akun <strong>{user.role}</strong> hanya dapat melihat daftar dan detail warung. Fitur
            tambah warung tersedia untuk owner dan admin.
          </p>
          <Link to="/" className="btn btn-primary">
            Kembali ke daftar warung
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}