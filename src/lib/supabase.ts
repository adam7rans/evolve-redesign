import { createClient, Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  return { data, error }
}

export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  })
  return { data, error }
}

export const signInWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
  })
  return { data, error }
}

export const signInWithTwitter = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
  })
  return { data, error }
}

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Add this new function for user registration
export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      console.error('Signup error:', error);
      if (error.message.includes('rate limit')) {
        return { data: null, error: new Error('Too many signup attempts. Please try again later.') };
      }
    }
    return { data, error }
  } catch (e) {
    console.error('Unexpected error during signup:', e);
    return { data: null, error: e as Error };
  }
}

export async function handleEmailConfirmation(): Promise<{ event: 'SIGNED_IN', session: Session } | null> {
  return new Promise((resolve) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        resolve({ event, session });
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      subscription.unsubscribe();
      resolve(null);
    }, 60000);
  });
}