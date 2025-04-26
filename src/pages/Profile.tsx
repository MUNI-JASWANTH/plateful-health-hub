
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, Bell, Calendar, Heart, Mail, Shield } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  if (!user) {
    return (
      <div className="pb-16">
        <div className="gradient-green py-8 px-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-1">Profile</h1>
            <p className="text-white/80">Manage your account</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold mb-3">Sign in to view your profile</h2>
          <p className="text-gray-500 mb-6">Manage your account settings and preferences</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/login')}>Sign In</Button>
            <Button onClick={() => navigate('/signup')} variant="outline">Create Account</Button>
          </div>
        </div>
      </div>
    );
  }

  // Profile sections for logged in users
  const profileSections = [
    { 
      icon: Settings, 
      title: 'Account Settings', 
      description: 'Update your personal information',
      action: () => navigate('/settings')
    },
    { 
      icon: Calendar, 
      title: 'Meal History', 
      description: 'View your meal logging history',
      action: () => navigate('/calories')
    },
    { 
      icon: Heart, 
      title: 'Favorite Recipes', 
      description: 'Access your saved recipes',
      action: () => navigate('/cookbook')
    },
    { 
      icon: Bell, 
      title: 'Notifications', 
      description: 'Manage your notification preferences',
      action: () => {} 
    },
  ];

  return (
    <div className="pb-16">
      <div className="bg-gradient-to-r from-green-500 to-teal-400 py-8 px-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-1">Profile</h1>
          <p className="text-white/80">Manage your account and preferences</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-plateful-primary text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
            {user.isAdmin && (
              <div className="mt-3 inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        >
          <div className="p-4 border-b">
            <h3 className="font-medium text-lg">Your Profile</h3>
          </div>
          
          <div className="divide-y">
            {profileSections.map((section, index) => (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="w-full text-left p-4 flex items-center"
                onClick={section.action}
              >
                <div className="w-10 h-10 rounded-full bg-plateful-primary/10 flex items-center justify-center mr-4">
                  <section.icon className="h-5 w-5 text-plateful-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{section.title}</h4>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        >
          {showConfirm ? (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium mb-4">Are you sure you want to logout?</h3>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="destructive"
                  onClick={confirmLogout}
                >
                  Yes, Logout
                </Button>
                <Button 
                  variant="outline"
                  onClick={cancelLogout}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full py-6 justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-none"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          )}
        </motion.div>
        
        <div className="text-center text-gray-400 text-xs mb-3">
          <p>Plateful v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
