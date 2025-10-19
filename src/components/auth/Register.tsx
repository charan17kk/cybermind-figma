'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'

interface RegisterProps {
  onSuccess?: () => void
  redirectTo?: string
}

export default function Register({ onSuccess, redirectTo = '/login' }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    reenterPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showReenterPassword, setShowReenterPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces'
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must be less than 100 characters'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password must be less than 128 characters'
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number'
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (@$!%*?&)'
    }

    // Re-enter password validation
    if (!formData.reenterPassword) {
      newErrors.reenterPassword = 'Please confirm your password'
    } else if (formData.password !== formData.reenterPassword) {
      newErrors.reenterPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Import the API
      const { usersApi } = await import('../../lib/api')
      
      // Call the register API
      const response = await usersApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'job-seeker' // Default role for new users
      })
      
      if (response.success) {
        alert('Account created successfully! Please login.')
        setIsLoading(false)
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess()
        } else {
          // Redirect to login page
          window.location.href = redirectTo
        }
      } else {
        // Handle validation errors from backend
        const errorMessage = response.error || response.message || 'Registration failed. Please try again.'
        if (errorMessage.includes('already exists')) {
          setErrors({ email: 'User with this email already exists' })
        } else {
          setErrors({ email: errorMessage })
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ email: 'Registration failed. Please try again.' })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="w-full max-w-3xl">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center mb-8 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Link>

        {/* Signup Card */}
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
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600">Join us and start your career journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your name"
                  />
                  <User className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            {/* Password and Re-enter Password Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
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

              {/* Re-enter Password Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Re-enter Password
                </label>
                <div className="relative">
                  <input
                    type={showReenterPassword ? 'text' : 'password'}
                    name="reenterPassword"
                    value={formData.reenterPassword}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 ${
                      errors.reenterPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowReenterPassword(!showReenterPassword)}
                    className="absolute right-3 top-1/2 text-gray-400 transform -translate-y-1/2 hover:text-gray-600"
                  >
                    {showReenterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.reenterPassword && <p className="mt-1 text-sm text-red-500">{errors.reenterPassword}</p>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <label className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="#" className="font-medium text-purple-600 hover:text-purple-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="font-medium text-purple-600 hover:text-purple-800">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="mr-2 w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-800">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
