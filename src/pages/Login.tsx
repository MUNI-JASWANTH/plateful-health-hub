
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Apple, Utensils } from 'lucide-react';
import LogoIcon from '@/assets/logo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});

  const validate = () => {
    const newErrors: {email?: string, password?: string} = {};
    let isValid = true;
    
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 p-4">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%]"><Apple size={32} className="text-plateful-primary" /></div>
        <div className="absolute top-[30%] right-[10%]"><Utensils size={24} className="text-plateful-accent" /></div>
        <div className="absolute bottom-[15%] left-[15%]"><Heart size={28} className="text-red-400" /></div>
        <div className="absolute bottom-[40%] right-[5%]"><Apple size={20} className="text-plateful-primary" /></div>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-plateful-primary to-plateful-secondary"></div>
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <LogoIcon className="w-16 h-16 mb-2" />
          <CardTitle className="text-2xl font-bold text-center text-plateful-dark">Welcome to Plateful</CardTitle>
          <p className="text-sm text-muted-foreground">Your personal health and nutrition companion</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-plateful-dark">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-white/70 ${errors.email ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium text-plateful-dark">Password</label>
                <Link to="/forgot-password" className="text-xs text-plateful-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-white/70 ${errors.password ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full bg-plateful-primary hover:bg-plateful-primary/90 transition-colors" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-plateful-primary hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
