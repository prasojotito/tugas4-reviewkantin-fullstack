import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canCreateStall } from '../utils/permissions';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { state: { message: 'Anda sudah logout.' } });
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span aria-hidden="true">🍴</span> Review Kantin
        </Link>

        <nav className="nav-links" aria-label="Navigasi utama">
          <NavLink to="/" end>
            Warung
          </NavLink>
          {canCreateStall(user) && <NavLink to="/stalls/new">Tambah Warung</NavLink>}
          {user ? (
            <>
              <NavLink to="/profile">Profil</NavLink>
              <span className="badge">
                {user.name} · {user.role}
              </span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}