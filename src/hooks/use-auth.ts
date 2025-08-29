'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  name: string
  email: string
  spokenLanguage: string
  learningLanguage: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setAuthState({
          user: userData.user,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Sign in failed:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const signUp = async (name: string, email: string, password: string, spokenLanguage?: string, learningLanguage?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          spokenLanguage, 
          learningLanguage 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Sign up failed:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      })
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
      // Still clear local state even if API call fails
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      router.push('/')
    }
  }
  
  const signInAsAdmin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // We don't set user state here, as admin is separate
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Admin sign in failed:', error);
      return { success: false, error: 'Network error' };
    }
  };


  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    checkAuth,
    signInAsAdmin,
  }
}
