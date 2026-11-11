import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { StallDetailPage } from './pages/StallDetailPage';
import { StallCreatePage } from './pages/StallCreatePage';
import { StallEditPage } from './pages/StallEditPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stalls/:id" element={<StallDetailPage />} />
                        <Route
              path="/stalls/new"
              element={
                <ProtectedRoute roles={['owner', 'admin']}>
                  <StallCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stalls/:id/edit"
              element={
                <ProtectedRoute roles={['owner', 'admin']}>
                  <StallEditPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <div className="card">
                  <h1>Halaman tidak ditemukan</h1>
                  <Link to="/">Kembali ke beranda</Link>
                </div>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;