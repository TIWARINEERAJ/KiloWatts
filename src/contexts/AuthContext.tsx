
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null, emailConfirmationRequired: boolean }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in: ', session?.user);
          toast.success("Signed in successfully");
          navigate('/dashboard');
        }
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      // Navigation is handled by onAuthStateChange
      toast.success("Signed in successfully");
    } else if (error.message.includes('Email not confirmed')) {
      toast.error("Please confirm your email before signing in", {
        description: "Check your inbox for a confirmation email"
      });
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (!error) {
        // Check if email confirmation is required
        const emailConfirmationRequired = data?.user?.identities && data.user.identities.length > 0 
          ? !data.user.identities[0].identity_data.email_verified
          : true;
          
        if (emailConfirmationRequired) {
          toast.success("Account created successfully. Please check your email to verify your account.");
          return { error: null, emailConfirmationRequired: true };
        } else {
          toast.success("Account created successfully! You can now sign in.");
          // Automatically redirect to login tab
          navigate('/auth?tab=signin');
          return { error: null, emailConfirmationRequired: false };
        }
      }
      
      return { error, emailConfirmationRequired: false };
    } catch (err: any) {
      console.error("Error during signup:", err);
      return { error: err, emailConfirmationRequired: false };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.info("Signed out successfully");
    // Navigation is handled by onAuthStateChange
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
