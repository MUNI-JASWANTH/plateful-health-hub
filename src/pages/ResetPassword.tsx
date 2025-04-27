
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '@/assets/logo';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Password requirements validation
    if (password) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
      } else if (!/[A-Z]/.test(password)) {
        setError('Password must contain at least one uppercase letter');
      } else if (!/[a-z]/.test(password)) {
        setError('Password must contain at least one lowercase letter');
      } else if (!/[0-9]/.test(password)) {
        setError('Password must contain at least one number');
      } else if (confirmPassword && password !== confirmPassword) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (error) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) throw error;
      
      setIsComplete(true);
      toast.success('Password has been reset successfully');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to reset password');
      setError(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 p-4">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%]"><Lock size={32} className="text-plateful-primary" /></div>
        <div className="absolute top-[30%] right-[10%]"><Lock size={24} className="text-plateful-accent" /></div>
        <div className="absolute bottom-[15%] left-[15%]"><Lock size={28} className="text-green-400" /></div>
        <div className="absolute bottom-[40%] right-[5%]"><Lock size={20} className="text-plateful-primary" /></div>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-plateful-primary to-plateful-secondary"></div>
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <LogoIcon className="w-16 h-16 mb-2" />
          <CardTitle className="text-2xl font-bold text-center text-plateful-dark">
            {isComplete ? 'Password Reset Complete' : 'Reset Your Password'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isComplete ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your password has been reset!</h3>
              <p className="text-gray-600 mb-4">You will be redirected to the login page shortly...</p>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full mt-2"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <div className="text-sm text-gray-500">
                Password must be at least 8 characters and include uppercase, lowercase, and numbers.
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-plateful-primary hover:bg-plateful-primary/90 transition-colors"
                disabled={isLoading || !!error || !password || !confirmPassword}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
