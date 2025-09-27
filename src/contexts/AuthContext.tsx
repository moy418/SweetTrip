import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signInWithSocial: (provider: 'google' | 'facebook' | 'instagram' | 'tiktok') => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  createSocialProfile: (user: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const createSocialProfile = useCallback(async (user: any) => {
    try {
      console.log('Creating profile for social user:', user.email)
      
      // Extract name information from user metadata
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.user_metadata?.display_name || ''
      
      const firstName = user.user_metadata?.given_name || 
                       user.user_metadata?.first_name || 
                       fullName.split(' ')[0] || null
      
      const lastName = user.user_metadata?.family_name || 
                      user.user_metadata?.last_name || 
                      fullName.split(' ').slice(1).join(' ') || null

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: firstName,
          last_name: lastName,
          preferred_currency: 'USD'
        })

      if (insertError) {
        console.error('Error creating profile:', insertError)
        throw insertError
      }

      console.log('Profile created successfully for:', user.email)
      return true
    } catch (error) {
      console.error('Error in createSocialProfile:', error)
      throw error
    }
  }, [])

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          await loadUserProfile(user.id)
        }
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setUser(session?.user || null)
        
        if (session?.user) {
          // Always try to load the profile first
          await loadUserProfile(session.user.id)
          
          // If no profile exists and this is a sign in event, create one
          if (event === 'SIGNED_IN') {
            // Check if profile exists after loading
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle()

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error checking profile:', profileError)
            }

            // If no profile exists, create one for social login users
            if (!profileData) {
              try {
                console.log('Creating profile for new social user:', session.user.email)
                await createSocialProfile(session.user)
                // Reload profile after creation
                await loadUserProfile(session.user.id)
              } catch (error) {
                console.error('Error creating profile in auth listener:', error)
              }
            }
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [createSocialProfile])

  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
    toast.success('¡Bienvenido de vuelta a tu Pasaporte Sweet Trip!')
  }

  async function signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.protocol}//${window.location.host}/auth/callback`
      }
    })

    if (error) {
      throw error
    }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    toast.success('¡Pasaporte creado! Revisa tu email para verificar tu cuenta.')
  }

  async function signInWithSocial(provider: 'google' | 'facebook' | 'instagram' | 'tiktok') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.protocol}//${window.location.host}/#/auth/callback`
      }
    })
    
    if (error) {
      throw error
    }
    
    toast.success(`¡Iniciando sesión con ${provider}!`)
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    toast.success('Sesión cerrada exitosamente')
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .maybeSingle()

    if (error) {
      throw error
    }

    setProfile(data)
    toast.success('Perfil actualizado exitosamente')
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signInWithSocial,
      signOut,
      updateProfile,
      createSocialProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
