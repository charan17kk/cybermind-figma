'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Calendar, ChevronDown } from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { DatePickerComponent } from '@/components/date-picker'
import { globalCities } from '@/lib/cities'
import { jobsApi } from '@/lib/api'


interface CreateJobModalProps {
  isOpen: boolean
  onClose: () => void
  onJobCreated?: (job: any) => void
}

export function CreateJobModal({ isOpen, onClose, onJobCreated }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobType: '',
    salary: '',
    deadline: '',
    description: '',
    experience: '' // explicit experience string provided by creator
  })
  const DESCRIPTION_LIMIT = 100
  const [locationSearch, setLocationSearch] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)

  // Load draft from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem('jobDraft')
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft))
      }
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Use a curated list of top 20 Indian IT locations for Create Job location field
  const topIndianITCities = [
    'Remote',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Mumbai',
    'Delhi',
    'Gurugram',
    'Noida',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Bhubaneswar',
    'Chandigarh',
    'Trivandrum',
    'Visakhapatnam',
    'Kochi',
    'Coimbatore',
    'Nagpur',
    'Indore'
  ]

  // Filter locations based on search from the curated top list
  const filteredLocations = topIndianITCities.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  )

  const generateMonthlySalary = (salaryInLakhs: string) => {
    if (!salaryInLakhs) return ''
    // Convert lakhs to monthly salary
    const lakhs = parseFloat(salaryInLakhs.replace(/[^\d.]/g, '')) || 0
    const annualInRupees = lakhs * 100000 // Convert lakhs to rupees
    const monthlyInRupees = Math.round(annualInRupees / 12)
    
    // Format monthly salary
    if (monthlyInRupees >= 100000) {
      return `₹${(monthlyInRupees / 100000).toFixed(1)}L/month`
    } else if (monthlyInRupees >= 1000) {
      return `₹${Math.round(monthlyInRupees / 1000)}k/month`
    } else {
      return `₹${monthlyInRupees}/month`
    }
  }

  const formatAnnualSalary = (salaryInLakhs: string) => {
    if (!salaryInLakhs) return ''
    const lakhs = parseFloat(salaryInLakhs.replace(/[^\d.]/g, '')) || 0
    return `₹${lakhs.toLocaleString()} Lakhs`
  }

  const getRandomExperience = () => {
    const experiences = ['0-1 years', '1-3 years', '2-5 years', '3-6 years', '5+ years']
    return experiences[Math.floor(Math.random() * experiences.length)]
  }

  // Simulates a backend delay between 2-4 seconds
  const simulateBackendDelay = () => {
    const delay = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000; // Random between 2000-4000ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // enforce description length
    if ((formData.description || '').length > DESCRIPTION_LIMIT) {
      alert(`Job description must be at most ${DESCRIPTION_LIMIT} characters.`)
      return
    }
    
    // Validate deadline is not in the past
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        alert('Application deadline cannot be in the past. Please select a present or future date.')
        return
      }
    }

    try {
      // Parse salary
      const salaryValue = parseFloat(formData.salary.replace(/[^\d.]/g, '')) || 10
      const salaryInRupees = salaryValue * 100000 // Convert LPA to rupees

      // Map job type
      const jobTypeMap: Record<string, 'full-time' | 'part-time' | 'contract' | 'internship'> = {
        'Full-time': 'full-time',
        'Part-time': 'part-time',
        'Contract': 'contract',
        'Internship': 'internship'
      }

      // Determine work location type and city
      let workLocationType = 'Onsite' // default
      const locationInput = formData.location.toLowerCase()
      
      if (locationInput.includes('remote') || locationInput === 'remote') {
        workLocationType = 'Remote'
      } else if (locationInput.includes('hybrid')) {
        workLocationType = 'Hybrid'
      }
      
      // Extract city name - if it's "Remote", keep it as Remote, otherwise use the input as city
      const cityName = workLocationType === 'Remote' ? 'Remote' : formData.location

      // Format salary in rupees
      const salaryString = `${salaryValue}LPA` // Add LPA once
      const monthlySalaryString = generateMonthlySalary(salaryValue.toString())
      
      const randomExperience = getRandomExperience()
      // Prefer explicit experience entered by creator, otherwise fallback to random
      const jobData = {
        title: formData.jobTitle,
        company: formData.company,
        location: workLocationType,
        city: cityName,
        type: formData.jobType,
        experience: formData.experience && formData.experience.trim() ? formData.experience.trim() : randomExperience,
        salary: salaryString,
        monthlySalary: monthlySalaryString,
        description: formData.description || 'Job description not provided.',
        skills: ["JavaScript", "React", "Node.js", "TypeScript"], // Default skills
        employmentType: formData.jobType
      }

      // Simulate backend delay
      await simulateBackendDelay();

      // Create job via backend API
      const response = await jobsApi.createJob(jobData)

      if (response.success && response.data) {
        const created = response.data

        // Notify parent component with success (pass backend document)
        if (onJobCreated) {
          onJobCreated(created)
        }

        alert('Job posted successfully!')

        // Clear draft from localStorage after successful publish
        localStorage.removeItem('jobDraft')

        // Reset form
        setFormData({
          jobTitle: '',
          company: '',
          location: '',
          jobType: '',
          salary: '',
          deadline: '',
          description: '',
          experience: ''
        })

        onClose()
      } else {
        alert('Failed to create job: ' + (response.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // If updating description, enforce max length locally
    if (name === 'description') {
      const truncated = value.slice(0, DESCRIPTION_LIMIT)
      setFormData({ ...formData, [name]: truncated })
      return
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSaveDraft = () => {
    // Save current form data to localStorage
    localStorage.setItem('jobDraft', JSON.stringify(formData))
    alert('Draft saved successfully!')
  }



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center w-screen h-screen p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200/50">
        <div className="max-h-[85vh] overflow-y-auto scrollbar-hide">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Create Job Opening</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Row 1: Job Title and Company Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Full Stack Developer"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Amazon, Microsoft, Swiggy"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Row 2: Location and Job Type */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative" ref={locationRef}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Choose Preferred Location"
                  value={formData.location || locationSearch}
                  onChange={(e) => {
                    const value = e.target.value
                    if (formData.location) {
                      setFormData(prev => ({ ...prev, location: '' }))
                    }
                    setLocationSearch(value)
                    setShowLocationDropdown(true)
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  className="w-full px-3 py-2.5 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                />
                <div className="absolute flex items-center space-x-1 transform -translate-y-1/2 right-2 top-1/2">
                  {(formData.location || locationSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, location: '' }))
                        setLocationSearch('')
                        setShowLocationDropdown(false)
                      }}
                      className="p-1 transition-colors rounded-full hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="p-1 transition-colors rounded-full hover:bg-gray-100"
                  >
                    <ChevronDown className={`w-4 h-4 text-gray-400 hover:text-gray-600 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Location Dropdown */}
              {showLocationDropdown && (locationSearch.length > 0 || !formData.location) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[130] max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {filteredLocations.slice(0, 10).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, location: loc }))
                          setLocationSearch('')
                          setShowLocationDropdown(false)
                        }}
                        className="w-full px-3 py-2.5 text-left hover:bg-purple-50 focus:bg-purple-50 text-sm text-gray-900 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">{loc}</span>
                        </div>
                      </button>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div className="px-3 py-3 text-sm text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          No locations found
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M17 12c-.667 1-1.5 1.5-2.5 1.5s-1.833-.5-2.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Job Type
              </label>
              <div className="relative">
                <Select value={formData.jobType} onValueChange={(value) => handleSelectChange('jobType', value)}>
                  <SelectTrigger className="w-full px-3 py-2.5 h-auto border border-gray-300 rounded-lg bg-white text-gray-900 text-sm hover:border-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors">
                    <SelectValue placeholder="Select Job Type" />
                  </SelectTrigger>
                  <SelectContent className="z-[120] bg-white shadow-xl border border-gray-200 max-h-60 overflow-y-auto rounded-lg" sideOffset={4}>
                    <div className="p-1">
                      <SelectItem className="py-2 px-3 text-sm rounded-md cursor-pointer hover:bg-gray-50" value="Internship">Internship</SelectItem>
                      <SelectItem className="py-2 px-3 text-sm rounded-md cursor-pointer hover:bg-gray-50" value="Full-time">Full-time</SelectItem>
                      <SelectItem className="py-2 px-3 text-sm rounded-md cursor-pointer hover:bg-gray-50" value="Part-time">Part-time</SelectItem>
                      <SelectItem className="py-2 px-3 text-sm rounded-md cursor-pointer hover:bg-gray-50" value="Contract">Contract</SelectItem>
                      
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          

          {/* Row 3: Annual Salary and Deadline */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Salary Per Annum
                </label>
                
              </div>
              <div className="relative">
  <input
    type="number"
    name="salary"
    value={formData.salary}
    onChange={handleChange}
    placeholder="INR 20 Lakhs"
    step="0.1"
    min="0"
    className="w-full pr-12 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm no-spinner"
  />
  <span className="absolute text-sm text-gray-400 transform -translate-y-1/2 right-3 top-1/2"></span>
</div>

              
            </div>

            <div>
              <DatePickerComponent
                label="Application Deadline"
                
                value={formData.deadline}
                onChange={(value) => {
                  const selectedDate = new Date(value)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  
                  if (selectedDate >= today || value === '') {
                    setFormData(prev => ({ ...prev, deadline: value }))
                  } else {
                    alert('Application deadline cannot be in the past. Please select a present or future date.')
                    setFormData(prev => ({ ...prev, deadline: '' }))
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          {/* Experience input (explicit by creator) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Experience
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write the job description here..."
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 text-sm resize-none"
            />
            <div className="flex items-center justify-end mt-2 text-xs text-gray-500">
              <span>{formData.description.length}/{DESCRIPTION_LIMIT}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors text-sm font-medium flex items-center gap-2 min-w-[140px]"
            >
              Save Draft
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 7l5 5 5-5 M7 12l5 5 5-5"/>
              </svg>
            </button>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#00AAFF] hover:bg-[#009BFF] text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2 min-w-[140px]"
              >
                Publish
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 7l6 5-6 5" />
                  <path d="M5 7l6 5-6 5" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        </div>
      </div>
    </div>
  )
}