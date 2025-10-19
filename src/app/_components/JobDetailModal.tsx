'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Users, Building2, Layers, MapPin, Calendar, Briefcase, CheckCircle, Star, Award, Target } from 'lucide-react'
import Image from 'next/image'

interface Job {
  id: string
  title: string
  company: string
  location: string
  city: string
  type: string
  experience: string
  salary: string
  monthlySalary: string
  description: string
  postedDate?: string
  createdAt?: string
}

interface JobDetailModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
  companyLogo: string
}

export function JobDetailModal({ job, isOpen, onClose, companyLogo }: JobDetailModalProps) {
  const [isApplied, setIsApplied] = useState(false)
  const [tick, setTick] = useState(0)
  const currentTimeRef = useRef<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      currentTimeRef.current = new Date()
      setTick(t => t + 1)
    }, 30 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Freeze body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !job) return null

  const handleApply = () => {
    setIsApplied(true)
    // Reset after 3 seconds
    setTimeout(() => {
      setIsApplied(false)
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image 
                src={companyLogo}
                alt={`${job.company} logo`}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-lg text-gray-600">{job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content with Internal Scrolling */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="p-8">
            {/* Job Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-800">Location</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{job.city}</p>
                <p className="text-xs text-gray-600">{job.location}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Briefcase className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-800">Job Type</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{job.type}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-800">Experience</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{job.experience}</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center mb-2">
                  <Layers className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-800">Salary</span>
                </div>
                <p className="text-sm font-bold text-green-600">{job.monthlySalary}</p>
                <p className="text-xs text-gray-600">({job.salary})</p>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-6 h-6 text-blue-600 mr-2" />
                Job Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-base mb-6">{job.description}</p>
            </div>

            {/* Key Responsibilities */}
            <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-2" />
                Key Responsibilities
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Develop and maintain high-quality software applications using modern technologies
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Collaborate with cross-functional teams to design and implement new features
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Write clean, maintainable, and well-documented code following best practices
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Participate in code reviews and contribute to technical discussions
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Troubleshoot and optimize applications for maximum performance and scalability
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Stay updated with latest industry trends and emerging technologies
                </li>
              </ul>
            </div>
            
            {/* Required Skills */}
            <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Star className="w-6 h-6 text-green-600 mr-2" />
                Required Skills & Qualifications
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Strong programming skills in relevant technologies and frameworks
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Experience with modern development tools and version control systems
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Knowledge of database design, optimization, and management
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Understanding of software development lifecycle and agile methodologies
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Excellent problem-solving and analytical thinking abilities
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Strong communication skills and ability to work in a team environment
                </li>
              </ul>
            </div>
            
            {/* Benefits & Perks */}
            <div className="mb-8 bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-6 h-6 text-purple-600 mr-2" />
                Benefits & Perks
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Competitive salary with performance-based bonuses and annual increments
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Comprehensive health insurance including medical, dental, and vision coverage
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Flexible working hours and hybrid/remote work opportunities
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Professional development budget for courses, conferences, and certifications
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Modern office environment with state-of-the-art equipment and tools
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Team building activities, wellness programs, and paid time off
                </li>
              </ul>
            </div>

            {/* Company Culture */}
            <div className="mb-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Company Culture</h4>
              <p className="text-gray-700 leading-relaxed">
                Join a dynamic and innovative team where creativity meets technology. We foster an inclusive environment 
                that encourages learning, growth, and collaboration. Our company values work-life balance and believes 
                in empowering employees to take ownership of their projects while providing the support needed to excel.
              </p>
            </div>

            {/* Posted Date */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Posted {
                    (() => {
                      try {
                        const created = job.createdAt ? new Date(job.createdAt) : null
                        if (!created || Number.isNaN(created.getTime())) return job.postedDate || 'Unknown'

                        // compute diff using currentTimeRef
                        const now = currentTimeRef.current || new Date()
                        const diffMs = now.getTime() - created.getTime()
                        const diffMinutes = Math.floor(diffMs / (1000 * 60))
                        const diffHours = Math.floor(diffMinutes / 60)

                        if (diffMinutes < 1) return 'Just now'
                        if (diffMinutes < 60) return `${diffMinutes}m ago`
                        if (diffHours < 24) return `${diffHours}h ago`

                        const yesterday = new Date(now)
                        yesterday.setDate(now.getDate() - 1)
                        if (created.getFullYear() === yesterday.getFullYear() && created.getMonth() === yesterday.getMonth() && created.getDate() === yesterday.getDate()) {
                          return 'Yesterday'
                        }

                        return created.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
                      } catch (e) {
                        return job.postedDate || 'Unknown'
                      }
                    })()
                  }
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-medium">✓ Currently accepting applications</span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200">
              {isApplied ? (
                <div className="flex items-center justify-center p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Successfully Applied!</span>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Apply for this Position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}