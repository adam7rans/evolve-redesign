import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      }
    })
    
    if (error) {
      console.error('Supabase signUp error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return { data: null, error }
    }
    
    console.log('Supabase signUp response:', JSON.stringify(data, null, 2))
    
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { data: null, error: new Error('User already exists') }
    }
    
    return { data, error: null }
  } catch (e) {
    console.error('Unexpected error during signUp:', e)
    return { data: null, error: e as Error }
  }
}

// Add any other Supabase-related functions here