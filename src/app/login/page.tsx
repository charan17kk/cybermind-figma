"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email) newErrors.email = "Email is required"
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setErrors({})
    if (!validateForm()) { setIsLoading(false); return }
    try {
      const { usersApi, auth } = await import("../../lib/api")
      const response = await usersApi.login({ email: formData.email, password: formData.password })
      if (response.success) {
        const token = (response as any).token || response.data?.token
        const user = (response as any).user || response.data?.user
        if (token && user) {
          auth.saveToken(token)
          auth.saveUser(user)
          alert("Login successful!")
          window.location.href = "/"
        } else {
          setError("Login response incomplete. Please try again.")
        }
      } else {
        setError(response.error || response.message || "Login failed. Please try again.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid email or password. Please check your credentials.")
    } finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f7fbff] to-[#fffaf6] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration / marketing panel */}
        <div className="hidden md:flex flex-col justify-center pl-12 pr-6">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back — good to see you</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">Sign in to pick up where you left off — your saved jobs and tailored recommendations are waiting.</p>
          </div>

          <div className="relative w-full max-w-lg">
            <div className="rounded-3xl bg-gradient-to-br from-[#fff6f2] to-[#eef8ff] p-6 shadow-xl border border-white/60">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Welcome back</h3>
                  <p className="text-sm text-gray-600">Quick sign in to continue exploring roles.</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Fast Sign-in</div>
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Saved Jobs</div>
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Smart Matches</div>
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Secure</div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-2xl bg-[#00AAFF]/10 blur-2xl"></div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md">
                <Image src="/logo.png" alt="logo" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
                <p className="text-sm text-gray-500">Sign in to continue</p>
              </div>
            </div>
            <div className="ml-auto text-sm text-gray-500">New here? <Link href="/signup" className="text-[#0077cc] font-semibold">Create account</Link></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" className={`w-full py-3 pl-10 pr-4 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-200'} bg-white text-gray-900`} />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Enter your password" className={`w-full py-3 pl-10 pr-12 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-200'} bg-white text-gray-900`} />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4 text-[#0077cc]" /> <span className="text-gray-600">Remember me</span></label>
              <Link href="#" className="text-[#0077cc] font-medium">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-[#0077cc] to-[#00aaff] text-white font-semibold rounded-lg shadow-md">{isLoading ? 'Signing in...' : 'Sign In'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
