
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
