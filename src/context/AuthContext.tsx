
import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useAuthService } from '@/hooks/useAuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
  } = useAuthService();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (session) {
        const profile = await updateUserState(session.user.id);
        handleProfileUpdate(session.user, profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      if (session) {
        updateUserState(session.user.id).then(profile => {
          handleProfileUpdate(session.user, profile);
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
