import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './useAuth';

export default function ProtectedRoute() {
  const { autenticado } = useAuth();
  const location = useLocation();
  if (autenticado) return <Outlet />;
  return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}
