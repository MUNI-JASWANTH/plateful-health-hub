
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LogoIcon from '@/assets/logo';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 to-blue-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 1.2 
          }}
          className="relative"
        >
          <LogoIcon className="w-16 h-16 mb-4" />
          <motion.div 
            className="absolute inset-0 border-2 border-amber-400 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5 
            }}
          />
        </motion.div>
        <div className="flex items-center mt-4">
          <Loader2 className="h-4 w-4 mr-2 text-amber-500 animate-spin" />
          <p className="text-amber-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
