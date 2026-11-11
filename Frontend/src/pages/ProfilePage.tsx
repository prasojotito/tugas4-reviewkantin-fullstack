import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) {
    return (
      <section className="profile-page" aria-label="Memuat profil">
        <div className="profile-card profile-loading">
          <div className="profile-avatar skeleton" />
          <div className="skeleton line w70" />
          <div className="skeleton line w40" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="profile-page">
        <div className="alert alert-error" role="alert">
          <strong>Profil gagal dimuat.</strong> {error.message}
        </div>
      </section>
    );
  }

  if (!user) return null;

  const roleLabel: Record<User['role'], string> = {
    admin: 'Administrator',
    owner: 'Pemilik warung',
    customer: 'Pelanggan',
  };

  return (
    <section className="profile-page" aria-labelledby="profile-title">
      <div className="profile-heading">
        <span className="auth-eyebrow">Akun kamu</span>
        <h1 id="profile-title">Profil Saya</h1>
        <p>Informasi akun yang terhubung dengan Review Kantin.</p>
      </div>

      <article className="profile-card">
        <div className="profile-banner">
          <span className="profile-banner-spark profile-spark-one" aria-hidden="true">
            ✦
          </span>
          <span className="profile-banner-spark profile-spark-two" aria-hidden="true">
            ✧
          </span>
          <div className="profile-avatar" aria-hidden="true">
            {user.name.trim().charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-user-heading">
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <span className={`profile-role profile-role-${user.role}`}>{roleLabel[user.role]}</span>
          </div>

          <div className="profile-divider" />

          <dl className="profile-details">
            <div className="profile-detail">
              <dt>
                <span className="profile-detail-icon" aria-hidden="true">
                  ◉
                </span>
                Nama lengkap
              </dt>
              <dd>{user.name}</dd>
            </div>
            <div className="profile-detail">
              <dt>
                <span className="profile-detail-icon" aria-hidden="true">
                  @
                </span>
                Alamat email
              </dt>
              <dd>{user.email}</dd>
            </div>
            <div className="profile-detail">
              <dt>
                <span className="profile-detail-icon" aria-hidden="true">
                  ◆
                </span>
                Tipe akun
              </dt>
              <dd>{roleLabel[user.role]}</dd>
            </div>
          </dl>

          <div className="profile-footer">
            <p>Senang kamu menjadi bagian dari komunitas kuliner kampus.</p>
            <Link to="/" className="btn btn-primary">
              Jelajahi warung <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
