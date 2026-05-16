import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RoleRouteProps {
  allowedRoles: ('client' | 'associate' | 'admin')[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboards based on role if they are logged in but unauthorized
    if (user?.role === 'client') return <Navigate to="/dashboard/client" replace />;
    if (user?.role === 'associate') return <Navigate to="/dashboard/associate" replace />;
    if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
