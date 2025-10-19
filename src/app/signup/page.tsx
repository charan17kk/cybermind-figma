"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function SignupPage() {
  // preserve original validation behaviour and state shape
  const [formData, setFormData] = useState({ name: "", email: "", password: "", reenterPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showReenterPassword, setShowReenterPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters"
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email) newErrors.email = "Email is required"
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (!formData.reenterPassword) newErrors.reenterPassword = "Please confirm your password"
    else if (formData.password !== formData.reenterPassword) newErrors.reenterPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const { usersApi } = await import("../../lib/api")
      const response = await usersApi.register({ name: formData.name, email: formData.email, password: formData.password, role: "job-seeker" })
      if (response.success) {
        alert("Account created successfully! Please login.")
        setIsLoading(false)
        window.location.href = "/login"
      } else {
        const err = response.error || response.message || "Registration failed. Please try again."
        if (err.includes("already exists")) setErrors({ email: "User with this email already exists" })
        else setErrors({ email: err })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ email: "Registration failed. Please try again." })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f7fbff] to-[#fffaf6] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration / marketing panel */}
        <div className="hidden md:flex flex-col justify-center pl-12 pr-6">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Build your future, one role at a time</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">Create a profile, show your skills, and get matched with modern teams across India and remote-first companies.</p>
          </div>

          <div className="relative w-full max-w-lg">
            <div className="rounded-3xl bg-gradient-to-br from-[#e6f6ff] to-[#fff1f8] p-6 shadow-xl border border-white/60">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Welcome on board</h3>
                  <p className="text-sm text-gray-600">Sign up to access personalized job recommendations.</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Verified Companies</div>
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Secure Profiles</div>
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Fast Applications</div>
                <div className="p-3 bg-white rounded-lg shadow-inner text-sm text-gray-700">Top Roles</div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-2xl bg-[#00AAFF]/10 blur-2xl"></div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </Link>
            <div className="ml-auto text-sm text-gray-500">Already have an account? <Link href="/login" className="text-[#0077cc] font-semibold">Sign in</Link></div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600 mb-6">A short profile gets you better matches — takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <div className="relative">
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className={`w-full py-3 pl-12 pr-4 rounded-lg border ${errors.name ? 'border-red-400' : 'border-gray-200'} bg-white text-gray-900`} />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@company.com" className={`w-full py-3 pl-12 pr-4 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-200'} bg-white text-gray-900`} />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required placeholder="Create password" className={`w-full py-3 pl-12 pr-12 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-200'} bg-white text-gray-900`} />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
                <div className="relative">
                  <input name="reenterPassword" type={showReenterPassword ? 'text' : 'password'} value={formData.reenterPassword} onChange={handleChange} required placeholder="Confirm password" className={`w-full py-3 pl-12 pr-12 rounded-lg border ${errors.reenterPassword ? 'border-red-400' : 'border-gray-200'} bg-white text-gray-900`} />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button type="button" onClick={() => setShowReenterPassword(!showReenterPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showReenterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
                {errors.reenterPassword && <p className="text-red-500 text-xs mt-1">{errors.reenterPassword}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" required className="w-4 h-4 text-[#0077cc] border-gray-300 rounded focus:ring-[#0077cc] mt-1" />
              <label className="text-sm text-gray-600">I agree to the <Link href="#" className="text-[#0077cc] font-medium">Terms</Link> and <Link href="#" className="text-[#0077cc] font-medium">Privacy Policy</Link></label>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-[#0077cc] to-[#00aaff] text-white font-semibold rounded-lg shadow-md hover:scale-[1.01] transition-transform">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}