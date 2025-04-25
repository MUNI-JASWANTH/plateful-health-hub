
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
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

  return (
    <div className="pb-16">
      <div className="gradient-green py-8 px-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-1">Profile</h1>
          <p className="text-white/80">Manage your account</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-10 w-10 text-gray-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
          {user.isAdmin && (
            <div className="mt-2 inline-flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
              Admin
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium">Account</h3>
          </div>
          
          <div className="divide-y">
            <div className="p-4">
              <Button 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
