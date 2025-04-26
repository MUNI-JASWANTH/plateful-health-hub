
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, Bell, Calendar, Heart, Mail, Shield, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCalories } from '@/context/CalorieContext';
import { Progress } from '@/components/ui/progress';
import AccountSettings from '@/components/AccountSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout } = useAuth();
  const { dailyGoal, getDailyCalories } = useCalories();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentCalories, setCurrentCalories] = useState<number>(0);
  const [isOverLimit, setIsOverLimit] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const calories = getDailyCalories(today);
    setCurrentCalories(calories);
    setIsOverLimit(calories > dailyGoal);

    // Set up realtime subscription for calorie logs
    if (user) {
      const channel = supabase
        .channel('calorie-updates')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'calorie_logs',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          console.log('New calorie log:', payload);
          // Update calories count
          const updatedCalories = getDailyCalories(today);
          setCurrentCalories(updatedCalories);
          
          // Check if over limit and notify
          if (updatedCalories > dailyGoal && !isOverLimit) {
            toast.warning("You've exceeded your daily calorie goal!", {
              description: `You've consumed ${updatedCalories} calories out of your ${dailyGoal} calorie goal.`,
              duration: 5000,
            });
            setIsOverLimit(true);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, dailyGoal, getDailyCalories]);
  
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

  const caloriePercentage = Math.min(Math.round((currentCalories / dailyGoal) * 100), 100);

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
          <div className="flex flex-col sm:flex-row items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow">
              <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-green-400 to-teal-500 text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
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
            
            <div className="mt-6 sm:mt-0">
              <Button 
                variant="outline" 
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Daily Calorie Goal</h3>
            <div className="flex items-center mb-1">
              <span className="text-lg font-bold">{currentCalories}</span>
              <span className="mx-1 text-gray-400">/</span>
              <span className="text-gray-500">{dailyGoal} calories</span>
              <span className="ml-auto text-sm font-medium">
                {caloriePercentage}%
              </span>
            </div>
            <Progress 
              value={caloriePercentage}
              className={`h-2 ${isOverLimit ? 'bg-red-100' : 'bg-green-100'}`}
              indicatorClassName={isOverLimit ? 'bg-red-500' : 'bg-green-500'}
            />
            {isOverLimit && (
              <p className="text-xs text-red-500 mt-1">
                You've exceeded your daily calorie goal!
              </p>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-lg">Quick Access</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                  <motion.button
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="p-4 flex items-center"
                    onClick={() => navigate('/calories')}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Calorie Tracking</h4>
                      <p className="text-sm text-gray-500">View and log your meals</p>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="p-4 flex items-center"
                    onClick={() => navigate('/cookbook')}
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                      <Heart className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Your Cookbook</h4>
                      <p className="text-sm text-gray-500">Saved recipes and favorites</p>
                    </div>
                  </motion.button>
                </div>
                
                <div className="p-4 border-t">
                  <h3 className="font-medium mb-2">Account Preferences</h3>
                  
                  <motion.button
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="w-full text-left p-4 flex items-center rounded-md"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-gray-500">Manage your notification settings</p>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="w-full text-left p-4 flex items-center rounded-md mt-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <Lock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Security</h4>
                      <p className="text-sm text-gray-500">Update password and security settings</p>
                    </div>
                  </motion.button>
                </div>
              </div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
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
            </TabsContent>
            
            <TabsContent value="settings">
              <AccountSettings />
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-lg">Security Settings</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Need to reset your password? You can request a password reset email.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-purple-500 text-purple-600 hover:bg-purple-50"
                    onClick={() => navigate('/forgot-password')}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <div className="text-center text-gray-400 text-xs mb-3 mt-6">
          <p>Plateful v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
