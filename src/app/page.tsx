'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Users, Building2, Layers, UserPlus } from 'lucide-react'
import Image from 'next/image'
import { Navigation } from './_components/Navigation'
import { Filters } from './_components/Filters'
import { JobDetailModal } from './_components/JobDetailModal'
import { jobsApi, Job as ApiJob } from '@/lib/api'

// Use the API Job interface but extend it for display purposes
interface Job {
  id: string
  title: string
  company: string
  location: string // Display location (Onsite, Remote, Hybrid)
  city: string // Actual city for filtering
  type: string
  experience: string
  salary: string
  monthlySalary: string // Monthly salary breakdown
  description: string
  postedDate?: string
  deadline?: string // Application deadline (optional for existing jobs)
  createdAt?: string // Creation timestamp
}

// Company logos mapping
const companyLogos: { [key: string]: string } = {
  'Amazon': '/Amazon.svg',
  'Tesla': '/tesla.svg',
  'Microsoft': '/microsoft.svg',
  'Google': '/Google.svg',
  'Apple': '/apple.svg',
  'Netflix': '/Netflix.svg',
  'Spotify': '/Spotify.svg',
  'Default': '/Default.svg',
  'CyberMind Works': '/CyberMind_Works.png',
  'Zomato': '/zomato.png'
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [salaryRange, setSalaryRange] = useState<[number, number]>([50, 250])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [maxSalary, setMaxSalary] = useState<number>(250)

  // Default jobs for fallback when API is unavailable
  const defaultJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'Amazon',
      location: 'Onsite',
      city: 'Seattle, WA',
      type: 'Full-time',
      experience: '3-5 yr Exp',
      salary: '18LPA',
      monthlySalary: '₹1.5L/month',
      description: 'Join our e-commerce platform team to build scalable web applications using React, Node.js, and AWS services. Work on high-traffic systems serving millions of users worldwide.',
      postedDate: '2h Ago'
    },
    {
      id: '2',
      title: 'Node.js Backend Developer',
      company: 'Tesla',
      location: 'Hybrid',
      city: 'Austin, TX',
      type: 'Full-time',
      experience: '2-4 yr Exp',
      salary: '16LPA',
      monthlySalary: '₹1.33L/month',
      description: 'Develop and maintain backend services for Tesla\'s vehicle software systems. Work with microservices, APIs, and real-time data processing using Node.js and MongoDB.',
      postedDate: '5h Ago'
    },
    {
      id: '3',
      title: 'Senior UX/UI Designer',
      company: 'Spotify',
      location: 'Remote',
      city: 'Remote',
      type: 'Full-time',
      experience: '4-6 yr Exp',
      salary: '14LPA',
      monthlySalary: '₹1.17L/month',
      description: 'Design intuitive user experiences for our music streaming platform. Collaborate with product teams to create engaging interfaces that delight millions of users.',
      postedDate: '1h Ago'
    },
    {
      id: '4',
      title: 'React Frontend Developer',
      company: 'Google',
      location: 'Onsite',
      city: 'San Francisco, CA',
      type: 'Full-time',
      experience: '2-4 yr Exp',
      salary: '20LPA',
      monthlySalary: '₹1.67L/month',
      description: 'Build modern web applications using React, TypeScript, and Material Design. Work on Google Workspace products used by billions of users globally.',
      postedDate: '3h Ago'
    },
    {
      id: '5',
      title: 'Mobile App Developer',
      company: 'Apple',
      location: 'Onsite',
      city: 'Los Angeles, CA',
      type: 'Full-time',
      experience: '3-5 yr Exp',
      salary: '22LPA',
      monthlySalary: '₹1.83L/month',
      description: 'Develop native iOS applications using Swift and SwiftUI. Create innovative mobile experiences and integrate with Apple\'s ecosystem of services and frameworks.',
      postedDate: '4h Ago'
    },
    {
      id: '6',
      title: 'Cloud Solutions Architect',
      company: 'Microsoft',
      location: 'Hybrid',
      city: 'New York, NY',
      type: 'Full-time',
      experience: '5-7 yr Exp',
      salary: '25LPA',
      monthlySalary: '₹2.08L/month',
      description: 'Design and implement enterprise cloud solutions using Azure services. Lead digital transformation projects and provide technical guidance to enterprise clients.',
      postedDate: '6h Ago'
    },
    {
      id: '7',
      title: 'DevOps Engineer',
      company: 'Netflix',
      location: 'Onsite',
      city: 'Chicago, IL',
      type: 'Full-time',
      experience: '3-6 yr Exp',
      salary: '19LPA',
      monthlySalary: '₹1.58L/month',
      description: 'Manage cloud infrastructure and CI/CD pipelines for Netflix\'s streaming platform. Work with Kubernetes, Docker, and AWS to ensure 99.9% uptime.',
      postedDate: '8h Ago'
    },
    {
      id: '8',
      title: 'Data Scientist',
      company: 'Tesla',
      location: 'Remote',
      city: 'Remote',
      type: 'Full-time',
      experience: '2-5 yr Exp',
      salary: '17LPA',
      monthlySalary: '₹1.42L/month',
      description: 'Analyze vehicle performance data and user behavior patterns. Build machine learning models for autonomous driving features using Python, TensorFlow, and big data technologies.',
      postedDate: '12h Ago'
    },
    {
      id: '9',
      title: 'Product Manager',
      company: 'Spotify',
      location: 'Hybrid',
      city: 'Boston, MA',
      type: 'Full-time',
      experience: '4-7 yr Exp',
      salary: '21LPA',
      monthlySalary: '₹1.75L/month',
      description: 'Lead product strategy for music discovery features. Collaborate with engineering, design, and data teams to enhance user engagement and music recommendation algorithms.',
      postedDate: '10h Ago'
    },
    {
      id: '10',
      title: 'Cybersecurity Specialist',
      company: 'Amazon',
      location: 'Onsite',
      city: 'Miami, FL',
      type: 'Contract',
      experience: '3-5 yr Exp',
      salary: '15LPA',
      monthlySalary: '₹1.25L/month',
      description: 'Monitor security threats and implement robust security protocols for AWS infrastructure. Conduct security audits and vulnerability assessments for enterprise clients.',
      postedDate: '14h Ago'
    },
    {
      id: '11',
      title: 'Junior Web Developer',
      company: 'Google',
      location: 'Hybrid',
      city: 'Austin, TX',
      type: 'Part-time',
      experience: '0-2 yr Exp',
      salary: '8LPA',
      monthlySalary: '₹67k/month',
      description: 'Learn and contribute to web development projects using modern frameworks. Great opportunity for recent graduates to work on Google Search and Ads platforms.',
      postedDate: '18h Ago'
    },
    {
      id: '12',
      title: 'AI/ML Engineer',
      company: 'Apple',
      location: 'Remote',
      city: 'Remote',
      type: 'Full-time',
      experience: '4-8 yr Exp',
      salary: '26LPA',
      monthlySalary: '₹2.17L/month',
      description: 'Develop machine learning models for Siri and other AI-powered Apple services. Work with neural networks, natural language processing, and computer vision technologies.',
      postedDate: '1d Ago'
    }
  ]

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to extract monthly salary value in thousands (e.g., "₹1.5L/month" -> 150, "₹67k/month" -> 67)
  const extractMonthlySalaryValue = (monthlySalaryString: string): number => {
    if (!monthlySalaryString) return 0
    
    // Handle formats like "₹1.5L/month" or "₹1,50,000/month" (convert to thousands)
    const lakhMatch = monthlySalaryString.match(/₹(\d+(?:\.\d+)?)L/)
    if (lakhMatch) {
      return Math.round(parseFloat(lakhMatch[1]) * 100) // Convert lakhs to thousands
    }
    
    // Handle formats like "₹67k/month" or "₹67,000/month"
    const thousandMatch = monthlySalaryString.match(/₹([\d,]+)(?:k|,000)/)
    if (thousandMatch) {
      return parseInt(thousandMatch[1].replace(/,/g, ''))
    }
    
    // Handle direct number formats like "₹150,000/month"
    const directMatch = monthlySalaryString.match(/₹([\d,]+)/)
    if (directMatch) {
      const value = parseInt(directMatch[1].replace(/,/g, ''))
      return Math.round(value / 1000) // Convert to thousands
    }
    
    return 0
  }

  // Extract dynamic data from jobs
  const updateDynamicFilters = (jobsList: Job[]) => {
    // Extract unique locations
    const locations = new Set<string>()
    let highestMonthlySalary = 250

    jobsList.forEach(job => {
      if (job.city && job.city !== 'Remote') {
        locations.add(job.city)
      }
      if (job.location) {
        locations.add(job.location)
      }

      // Extract monthly salary from monthlySalary field using the same logic as the filter
      if (job.monthlySalary) {
        const monthlyThousands = extractMonthlySalaryValue(job.monthlySalary)
        if (monthlyThousands > highestMonthlySalary) {
          highestMonthlySalary = Math.ceil(monthlyThousands / 50) * 50 // Round up to nearest 50
        }
      }
      
      // Fallback: extract from salary field (LPA format)
      if (job.salary && !job.monthlySalary) {
        const salaryMatch = job.salary.match(/(\d+)LPA/)
        if (salaryMatch) {
          const annualLakhs = parseInt(salaryMatch[1])
          const monthlyThousands = Math.round((annualLakhs * 100000) / 12 / 1000)
          if (monthlyThousands > highestMonthlySalary) {
            highestMonthlySalary = Math.ceil(monthlyThousands / 50) * 50
          }
        }
      }
    })

    setAvailableLocations(Array.from(locations).sort())
    setMaxSalary(highestMonthlySalary)
    // Update salary range if current max is less than new max
    setSalaryRange(prev => [prev[0], Math.max(prev[1], highestMonthlySalary)])
  }

  // Convert API job to display format
  const convertApiJobToDisplayJob = (apiJob: any): Job => {
    // Helper to normalize createdAt coming from various API shapes
    const normalizeCreatedAt = (val: any): string | undefined => {
      if (!val) return undefined
      // If it's an object with $date (Mongo export), try that
      if (typeof val === 'object' && val.$date) {
        try { return new Date(val.$date).toISOString() } catch (e) { return undefined }
      }
      // If it's a Date-like object
      if (typeof val === 'object' && typeof val.toISOString === 'function') {
        try { return new Date(val).toISOString() } catch (e) { return undefined }
      }
      // If it's a string
      if (typeof val === 'string') {
        const parsed = new Date(val)
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
      }
      return undefined
    }
    // Handle both old and new salary formats
    let salaryDisplay = apiJob.salary || '0LPA'
    let monthlySalaryDisplay = apiJob.monthlySalary || '₹0k/month'

    // If salary is an object (old format), convert it
    if (typeof apiJob.salary === 'object' && apiJob.salary.min && apiJob.salary.max) {
      const yearlyAmount = (apiJob.salary.min + apiJob.salary.max) / 2
      const monthlyAmount = yearlyAmount / 12
      salaryDisplay = `${Math.round(yearlyAmount / 100000)}LPA`
      monthlySalaryDisplay = monthlyAmount >= 100000 
        ? `₹${(monthlyAmount / 100000).toFixed(1)}L/month`
        : `₹${Math.round(monthlyAmount / 1000)}k/month`
    }

    // Map location - use the location field directly from backend
    const locationDisplay = apiJob.location || 'Onsite'

    // Map experience - handle various formats
    const experienceMap: Record<string, string> = {
      'Entry level': '0-2 yr Exp',
      'Mid-level': '2-4 yr Exp', 
      'Senior': '3-6 yr Exp',
      'Lead': '5+ yr Exp',
      'entry': '0-2 yr Exp',
      'mid': '2-4 yr Exp', 
      'senior': '3-6 yr Exp',
      'lead': '5+ yr Exp'
    }

    // Calculate posted date
    // Keep createdAt as a source of truth for live relative times
    return {
      id: apiJob._id || apiJob.id || '',
      title: apiJob.title || 'Untitled Job',
      company: apiJob.company || 'Unknown Company',
      location: locationDisplay,
      city: apiJob.city || apiJob.location || 'Unknown',
      type: apiJob.type || 'Full-time',
      experience: experienceMap[apiJob.experience] || `${apiJob.experience || 'Any'}`,
      salary: salaryDisplay,
      monthlySalary: monthlySalaryDisplay,
      description: apiJob.description || 'No description available',
      deadline: apiJob.applicationDeadline,
      createdAt: normalizeCreatedAt(apiJob.createdAt),
    }
  }

  // Helper function for relative time
  const getRelativeTime = (date: Date): string => {
    // Use currentTimeRef to keep timings consistent during re-renders
    const now = currentTimeRef.current || new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    // If within 1 minute, show 'Just now'
    if (diffMinutes < 1) return 'Just now'

    // Less than 1 hour: show minutes
    if (diffMinutes < 60) return `${diffMinutes}m ago`

    // Less than a day: show hours
    if (diffHours < 24) return `${diffHours}h ago`

    // If it was yesterday (calendar day before)
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()) {
      return 'Yesterday'
    }

    // Older: show date in 'DD MMM' format (e.g., 18 Oct)
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  }

  // Keep a ref of current time and a ticking state to update relative times in real-time
  const [tick, setTick] = useState(0)
  const currentTimeRef = useRef<Date>(new Date())

  useEffect(() => {
    // update every 30 seconds to keep UI responsive without excessive updates
    const interval = setInterval(() => {
      currentTimeRef.current = new Date()
      setTick(t => t + 1)
    }, 30 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Load jobs from backend API on component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        setError(null)

  const response = await jobsApi.getJobs({ limit: 100 })

        if (response.success && response.data) {
          // response.data may be an array or an object containing data - handle both
          const jobsArray = Array.isArray(response.data) ? response.data : (Array.isArray((response as any).data) ? (response as any).data : response.data)
          const displayJobs = Array.isArray(jobsArray)
            ? jobsArray.map(convertApiJobToDisplayJob)
            : []

          console.log('Backend jobs loaded:', displayJobs.length)
          setJobs(displayJobs)
          updateDynamicFilters(displayJobs)
        } else {
          console.warn('Backend jobs API failed, using default jobs')
          setJobs(defaultJobs)
          updateDynamicFilters(defaultJobs)
        }
      } catch (error) {
        console.error('Error loading backend jobs:', error)
        setError('Failed to load jobs')
        setJobs(defaultJobs)
        updateDynamicFilters(defaultJobs)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  // Function to clean expired jobs - now handled by backend
  const cleanExpiredJobs = useCallback(() => {
    // This is now handled by the backend automatically
    // We can refresh the jobs list to get the latest active jobs
    const refreshJobs = async () => {
      try {
        const response = await jobsApi.getJobs({ limit: 100 })
        if (response.success && response.data) {
          const jobsArray = Array.isArray(response.data) ? response.data : []
          const displayJobs = jobsArray.map(convertApiJobToDisplayJob)
          setJobs(displayJobs)
          updateDynamicFilters(displayJobs)
        }
      } catch (error) {
        console.error('Error refreshing jobs:', error)
      }
    }
    refreshJobs()
  }, [convertApiJobToDisplayJob, updateDynamicFilters])

  // Function to handle new job creation
  const handleJobCreated = async (newJob: any) => {
    // If the created job was passed in (from the create response), prepend it so UI shows "Just now" immediately
    try {
      if (newJob && (newJob._id || newJob.id)) {
        const displayJob = convertApiJobToDisplayJob(newJob)
        // If backend didn't return createdAt, set it to now so UI shows 'Just now'
        if (!displayJob.createdAt) displayJob.createdAt = new Date().toISOString()
        setJobs(prev => [displayJob, ...prev.filter(j => j.id !== displayJob.id)])
        updateDynamicFilters([displayJob, ...jobs])
        return
      }

      // Otherwise refresh from backend to get latest list
  const response = await jobsApi.getJobs({ limit: 100 })
      if (response.success && response.data) {
        const jobsArray = Array.isArray(response.data) ? response.data : (Array.isArray((response as any).data) ? (response as any).data : response.data)
        const displayJobs = Array.isArray(jobsArray)
          ? jobsArray.map(convertApiJobToDisplayJob)
          : []

        setJobs(displayJobs)
        updateDynamicFilters(displayJobs)
        return
      }
    } catch (error) {
      console.error('Error refreshing jobs after creation:', error)
    }

    // Fallback: if everything fails, just keep local state
    console.warn('Could not refresh jobs after creation, keeping local state')
  }

  // Check for expired jobs (disabled to prevent iteration issues)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     cleanExpiredJobs()
  //   }, 60 * 60 * 1000) // Run every hour

  //   // Also run on component mount after a short delay
  //   const timeout = setTimeout(() => {
  //     cleanExpiredJobs()
  //   }, 1000) // Run after 1 second

  //   return () => {
  //     clearInterval(interval)
  //     clearTimeout(timeout)
  //   }
  // }, [])

  // This useEffect can be removed as we're now using proper prop passing

  const getCompanyLogo = (company: string) => {
    return companyLogos[company] || companyLogos['Default']
  }

  // Filter jobs based on search term, location, job type, and salary range
  const filteredJobs = jobs.filter(job => {
    // Search filter
    const matchesSearch = searchTerm.length < 3 || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type.toLowerCase().includes(searchTerm.toLowerCase())

    // Location filter - match both city and location type
    const matchesLocation = !locationFilter || 
      job.location.toLowerCase() === locationFilter.toLowerCase() ||
      job.city.toLowerCase() === locationFilter.toLowerCase() ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
      job.city.toLowerCase().includes(locationFilter.toLowerCase())

    // Job type filter - handle both exact matches and contains
    const matchesJobType = !jobTypeFilter || 
      job.type.toLowerCase() === jobTypeFilter.toLowerCase() ||
      job.type.toLowerCase().includes(jobTypeFilter.toLowerCase())

    // Monthly salary range filter
    const jobMonthlySalary = extractMonthlySalaryValue(job.monthlySalary)
    const matchesSalary = jobMonthlySalary >= salaryRange[0] && jobMonthlySalary <= salaryRange[1]

    // Debug logging (remove in production)
    if (locationFilter && job.id === '1') {
      console.log('Debug job 1:', {
        locationFilter,
        jobLocation: job.location,
        jobCity: job.city,
        matchesLocation,
        jobMonthlySalary,
        salaryRange,
        matchesSalary,
        monthlySalaryString: job.monthlySalary
      })
    }

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary
  })

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  const handleLocationChange = (location: string) => {
    setLocationFilter(location)
  }

  const handleJobTypeChange = (jobType: string) => {
    setJobTypeFilter(jobType)
  }

  const handleSalaryRangeChange = (range: [number, number]) => {
    setSalaryRange(range)
  }

  const openJobModal = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const closeJobModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  // track applied job ids locally for UI-only applied state
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([])

  const handleApplyOnCard = (jobId: string) => {
    setAppliedJobIds(prev => (prev.includes(jobId) ? prev : [...prev, jobId]))
  }

  return (
    <>
      <Navigation onJobCreated={handleJobCreated} />
      <Filters 
        onSearchChange={handleSearchChange}
        onLocationChange={handleLocationChange}
        onJobTypeChange={handleJobTypeChange}
        onSalaryRangeChange={handleSalaryRangeChange}
        availableLocations={availableLocations}
        maxSalary={maxSalary}
      />
      
  {/* Job Cards */}
  {/* The Filters component is fixed with height ~48 (as set). We add 1cm gap below it using padding-top calculation. */}
  <main className="container px-4 pb-8 mx-auto" style={{ paddingTop: 'calc(200px + 1cm)' }}>
        {(searchTerm.length >= 3 || locationFilter || jobTypeFilter || salaryRange[0] > 50 || salaryRange[1] < maxSalary) && (
          <div className="mb-6">
            {(searchTerm.length >= 3 || locationFilter || jobTypeFilter) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {searchTerm.length >= 3 && (
                  <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
                {locationFilter && (
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Location: {locationFilter}
                  </span>
                )}
                {jobTypeFilter && (
                  <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    Type: {jobTypeFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        {filteredJobs.length === 0 && (searchTerm.length >= 3 || locationFilter || jobTypeFilter || salaryRange[0] > 50 || salaryRange[1] < maxSalary) ? (
          <div className="flex items-center justify-center py-16 text-center">
            <div className="max-w-md text-center text-gray-700">
              <h3 className="text-xl font-semibold">Uh Oh!</h3>
              <p className="mt-2 text-sm">No jobs for the current filters.</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-600 mb-2">No jobs found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredJobs.map((job) => (
            <div key={job.id} className="flex flex-col p-6 transition-shadow bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl h-80">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm p-2">
                  {/* glossy light-gray rounded square with circular logo that fills the inner area */}
                  <Image
                    src={getCompanyLogo(job.company)}
                    alt={`${job.company} logo`}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full rounded-full bg-transparent"
                  />
                </div>
                <span className="px-3 py-1.5 text-xs font-semibold text-[#083d66] bg-[#bfe8fb] rounded-md shadow-sm" style={{minWidth: 52, textAlign: 'center'}}>
                  {(() => {
                    try {
                      if (job.createdAt) {
                        const d = new Date(job.createdAt)
                        if (!Number.isNaN(d.getTime())) return getRelativeTime(d)
                      }
                      return job.postedDate || 'Unknown'
                    } catch (e) {
                      return job.postedDate || 'Unknown'
                    }
                  })()}
                </span>
              </div>

              {/* Job Title */}
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                {job.title}
              </h3>

              {/* Job Details */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <UserPlus className="w-3 h-3 mr-1" />
                  <span>{job.experience}</span>
                  <Building2 className="w-3 h-3 ml-3 mr-1" />
                  <span>{job.location}</span>
                  <Layers className="w-3 h-3 ml-3 mr-1" />
                  <span>{job.salary}</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex-grow mb-2 overflow-y-auto max-h-16 pr-2">
                <p className="text-xs leading-relaxed text-gray-600">
                  {job.description}
                </p>
              </div>

              {/* Apply Button */}
              {appliedJobIds.includes(job.id) ? (
                <div className="w-full px-4 py-3 mt-auto font-medium text-white bg-green-500 rounded-xl text-center">Applied</div>
              ) : (
                <button 
                  onClick={() => handleApplyOnCard(job.id)}
                  className="w-full px-4 py-3 mt-auto font-medium text-white transition-colors bg-blue-500 hover:bg-blue-600 rounded-xl"
                >
                  Apply Now
                </button>
              )}
            </div>
          ))}
          </div>
        )}
      </main>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeJobModal}
        companyLogo={selectedJob ? getCompanyLogo(selectedJob.company) : ''}
      />
    </>
  )
}
