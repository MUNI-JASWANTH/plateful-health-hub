
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowLeft, Heart, Apple, Utensils } from 'lucide-react';
import LogoIcon from '@/assets/logo';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Reset password error", error);
      setError(error.message || 'An error occurred');
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
          <CardTitle className="text-2xl font-bold text-center text-plateful-dark">
            {isSubmitted ? 'Check Your Email' : 'Reset Password'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isSubmitted 
              ? 'We\'ve sent you instructions to reset your password' 
              : 'Enter your email to receive a password reset link'}
          </p>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-plateful-dark">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-white/70 ${error ? "border-red-500" : "border-gray-200"}`}
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-plateful-primary hover:bg-plateful-primary/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? <span className="flex items-center justify-center"><Lock className="mr-2 h-4 w-4 animate-spin" /> Sending...</span> : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="py-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-green-700">A password reset link has been sent to {email}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Check your inbox and click on the link to reset your password. If you don't see the email, check your spam folder.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link to="/login" className="text-plateful-primary hover:underline font-medium flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
