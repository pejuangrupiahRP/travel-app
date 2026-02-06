import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Jika tidak ada token, tendang ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, izinkan akses ke halaman yang dituju (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;