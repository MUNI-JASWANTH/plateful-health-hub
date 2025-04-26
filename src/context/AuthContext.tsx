
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: {name?: string, email?: string, avatar_url?: string}) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (session) {
        // Fetch the user's profile data including role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log("Profile data:", profile);

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || '',
          isAdmin: profile?.role === 'admin',
          avatarUrl: profile?.avatar_url || null
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      if (session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
              setIsLoading(false);
              return;
            }
            
            console.log("Initial profile data:", profile);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile?.name || '',
              isAdmin: profile?.role === 'admin',
              avatarUrl: profile?.avatar_url || null
            });
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      const { error: signUpError, data } = await supabase.auth.signUp({
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
      
      // Update auth email if included
      if (data.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: data.email });
        if (emailError) throw emailError;
      }

      // Update profile data
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
      
      // Update local user state
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      resetPassword,
      updateUserProfile,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
