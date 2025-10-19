'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'

interface LoginProps {
  onSuccess?: () => void
  redirectTo?: string
}

export default function Login({ onSuccess, redirectTo = '/' }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear general error when user starts typing
    // Clear field-specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setErrors({})
    
    // Validate form first
    if (!validateForm()) {
      setIsLoading(false)
      return
    }
    
    try {
      console.log('Starting login process...')
      console.log('Form data:', { email: formData.email, password: '***' })
      
      // Import the API
      const { usersApi, auth } = await import('../../lib/api')
      console.log('API imported successfully')
      
      // Call the login API
      console.log('Calling login API...')
      const response = await usersApi.login({
        email: formData.email,
        password: formData.password
      })
      
      console.log('API response:', response)
      
      if (response.success) {
        console.log('Login successful, checking response structure')
        
        // Handle both possible response structures
        const token = (response as any).token || response.data?.token
        const user = (response as any).user || response.data?.user
        
        if (token && user) {
          console.log('Token and user found, saving auth data')
          // Save authentication data
          auth.saveToken(token)
          auth.saveUser(user)
          
          alert('Login successful!')
          setIsLoading(false)
          
          // Call success callback if provided
          if (onSuccess) {
            onSuccess()
          } else {
            // Redirect to home page
            window.location.href = redirectTo
          }
        } else {
          console.log('Missing token or user in response:', { token: !!token, user: !!user })
          setError('Login response incomplete. Please try again.')
          setIsLoading(false)
        }
      } else {
        console.log('Login failed:', response)
        setError(response.error || response.message || 'Login failed. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid email or password. Please check your credentials.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-lg">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center mb-8 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="overflow-hidden w-16 h-16 rounded-full">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={64} 
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 text-gray-400 transform -translate-y-1/2 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="mr-2 w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-800">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
