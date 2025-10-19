'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../lib/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: { name: string; email: string; password: string; role: 'job-seeker' | 'employer' }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = async () => {
      try {
        const { auth } = await import('../lib/api')
        const savedToken = auth.getToken()
        const savedUser = auth.getUser()
        
        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(savedUser)
          
          // Optionally verify token with backend
          try {
            const { usersApi } = await import('../lib/api')
            const response = await usersApi.getProfile()
            if (response.success && response.data) {
              setUser(response.data)
              auth.saveUser(response.data)
            } else {
              // Token is invalid, clear auth data
              auth.logout()
              setToken(null)
              setUser(null)
            }
          } catch (error) {
            console.log('Token verification failed, clearing auth data')
            auth.logout()
            setToken(null)
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { usersApi, auth } = await import('../lib/api')
      const response = await usersApi.login({ email, password })
      
      if (response.success) {
        const token = (response as any).token || response.data?.token
        const user = (response as any).user || response.data?.user
        
        if (token && user) {
          auth.saveToken(token)
          auth.saveUser(user)
          setToken(token)
          setUser(user)
          return { success: true }
        } else {
          return { success: false, error: 'Login response incomplete' }
        }
      } else {
        return { success: false, error: response.error || response.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (userData: { name: string; email: string; password: string; role: 'job-seeker' | 'employer' }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { usersApi } = await import('../lib/api')
      const response = await usersApi.register(userData)
      
      if (response.success) {
        return { success: true }
      } else {
        return { success: false, error: response.error || response.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      const { auth } = await import('../lib/api')
      auth.logout()
      setToken(null)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null)
    
    // Also update localStorage
    try {
      const { auth } = await import('../lib/api')
      const currentUser = auth.getUser()
      if (currentUser) {
        auth.saveUser({ ...currentUser, ...userData })
      }
    } catch (error) {
      console.error('Error updating user in localStorage:', error)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
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
