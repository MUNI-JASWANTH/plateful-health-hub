
import { useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProfileData } from '@/types/auth';

export const useAuthService = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateUserState = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return profile;
  };

  const handleProfileUpdate = (sessionUser: any, profile: ProfileData | null) => {
    if (!profile) return;
    
    setUser({
      id: sessionUser.id,
      email: sessionUser.email!,
      name: profile.name || '',
      isAdmin: profile.role === 'admin',
      avatarUrl: profile.avatar_url || null
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      toast.success("Login successful! Welcome back.");
      navigate('/');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Error logging in');
      throw new Error(error.message || 'Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      toast.success("Account created successfully!");
      navigate('/');
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Error signing up');
      throw new Error(error.message || 'Error signing up');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Error logging out');
      throw new Error(error.message || 'Error logging out');
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Error sending password reset email');
      throw new Error(error.message || 'Error sending password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: {name?: string, email?: string, avatar_url?: string}) => {
    try {
      if (!user) throw new Error("Not authenticated");
      
      if (data.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: data.email });
        if (emailError) throw emailError;
      }

      const updateData: Record<string, any> = {};
      if (data.name) updateData.name = data.name;
      if (data.avatar_url) updateData.avatar_url = data.avatar_url;
      
      if (Object.keys(updateData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
        
        if (profileError) throw profileError;
      }
      
      setUser({
        ...user,
        name: data.name || user.name,
        email: data.email || user.email,
        avatarUrl: data.avatar_url || user.avatarUrl
      });
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Error updating profile');
      throw new Error(error.message || 'Error updating profile');
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      toast.success("Password updated successfully!");
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Error updating password');
      throw new Error(error.message || 'Error updating password');
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    updatePassword,
    updateUserState,
    handleProfileUpdate
  };
};
