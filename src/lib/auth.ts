import { User } from './api'

// Authentication utilities
export const auth = {
  // Save token to localStorage
  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },

  // Remove token from localStorage
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  // Save user data to localStorage
  saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
  },

  // Get user data from localStorage
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser')
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  // Remove user data from localStorage
  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
  },

  // Logout user (remove token and user data)
  logout(): void {
    this.removeToken()
    this.removeUser()
  }
}

export default auth
