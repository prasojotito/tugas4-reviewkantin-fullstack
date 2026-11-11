import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
      <div className="alert alert-error">
        <strong>403 - Akses ditolak.</strong> Role Anda ({user.role}) tidak memiliki izin untuk
        halaman ini.
      </div>
    );
  }

  return <>{children}</>;
}