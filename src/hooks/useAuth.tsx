import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (password: string, name: string, username: string) => Promise<{ error: any }>;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (password: string, name: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    // First check if username is already taken
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();
    
    if (checkError) {
      return { error: checkError };
    }
    
    if (existingUser) {
      return { error: { message: 'Username is already taken' } };
    }
    
    // Generate internal email based on username using valid domain
    const internalEmail = `${username}+ig@example.com`;
    
    const { data, error } = await supabase.auth.signUp({
      email: internalEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name, username }
      }
    });
    
    // If signup successful, update the profile with username
    if (!error && data.user) {
      // Wait a bit for the profile to be created by trigger
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username, name })
        .eq('id', data.user.id);
      
      if (profileError) {
        console.error('Profile update error:', profileError);
        return { error: { message: 'Account created but username setup failed. Please contact support.' } };
      }
    }
    
    return { error };
  };

  const signIn = async (username: string, password: string) => {
    // First, get the email associated with this username
    const { data: emailData, error: lookupError } = await supabase
      .rpc('get_email_by_username', { username_input: username });
    
    if (lookupError || !emailData) {
      return { error: { message: 'Invalid username or password' } };
    }
    
    // Then sign in with the email
    const { error } = await supabase.auth.signInWithPassword({
      email: emailData,
      password,
    });
    
    return { error: error || null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};