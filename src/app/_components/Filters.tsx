'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { Search, MapPin, User, Volume2, X, ChevronDown } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Separator } from '@/components/separator'
import { globalCities } from '@/lib/cities'

interface FiltersProps {
  onSearchChange: (searchTerm: string) => void
  onLocationChange: (location: string) => void
  onJobTypeChange: (jobType: string) => void
  onSalaryRangeChange: (salaryRange: [number, number]) => void
  availableLocations?: string[]
  maxSalary?: number
}

export function Filters({ onSearchChange, onLocationChange, onJobTypeChange, onSalaryRangeChange, availableLocations = [], maxSalary = 250 }: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [salaryRange, setSalaryRange] = useState([1, maxSalary])
  const [locationSearch, setLocationSearch] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)

  // Update salary range when maxSalary changes
  React.useEffect(() => {
    setSalaryRange(prev => [prev[0], Math.max(prev[1], maxSalary)])
  }, [maxSalary])

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

  // Prefer database-backed availableLocations when provided; otherwise fall back to globalCities
  const allLocations = (availableLocations && availableLocations.length > 0) ?
    Array.from(new Set(availableLocations)).sort() :
    Array.from(new Set(globalCities)).sort()

  // Filter locations based on search
  const filteredLocations = allLocations.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  )

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
  ]

  return (
    <div className="fixed left-0 right-0 z-[55] flex items-end h-48 px-6 pt-6 pb-2 bg-white border border-gray-100 shadow-lg">
      <div className="flex items-center w-full">
        
        {/* Search Input */}
        <div className="relative flex items-center flex-1 px-6 py-2">
          <Search className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search By Job Title, Role"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value
              setSearchTerm(value)
              // Only trigger search when 3+ characters or empty (to show all)
              if (value.length >= 3 || value.length === 0) {
                onSearchChange(value)
              }
            }}
            className="w-full pr-8 text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
                onSearchChange('')
              }}
              className="absolute p-1 transition-colors rounded-full right-8 hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <Separator orientation="vertical" className="h-12 mx-2" />

        {/* Location Filter */}
        <div className="relative flex items-center flex-1 px-6 py-2" ref={locationRef}>
          <MapPin className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Preferred Location"
              value={location || locationSearch}
              onChange={(e) => {
                const value = e.target.value
                if (location) {
                  setLocation('')
                  onLocationChange('')
                }
                setLocationSearch(value)
                setShowLocationDropdown(true)
              }}
              onFocus={() => setShowLocationDropdown(true)}
              className="w-full pr-16 text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {(location || locationSearch) && (
                <button
                  onClick={() => {
                    setLocation('')
                    setLocationSearch('')
                    onLocationChange('')
                    setShowLocationDropdown(false)
                  }}
                  className="p-1 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="p-1 transition-colors rounded-full hover:bg-gray-100"
              >
                <ChevronDown className={`w-4 h-4 text-gray-400 hover:text-gray-600 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Dropdown */}
            {showLocationDropdown && (locationSearch.length > 0 || !location) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[80] max-h-60 overflow-y-auto">
                <div className="p-2">
                  {filteredLocations.slice(0, 10).map((loc, index) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc)
                        setLocationSearch('')
                        setShowLocationDropdown(false)
                        onLocationChange(loc)
                      }}
                      className="w-full px-3 py-2.5 text-left hover:bg-blue-50 focus:bg-blue-50 text-sm text-gray-900 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{loc}</span>
                      </div>
                    </button>
                  ))}
                  {filteredLocations.length === 0 && (
                    <div className="px-3 py-3 text-sm text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        No locations found
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="h-12 mx-2" />

        {/* Job Type Filter */}
        <div className="flex items-center flex-1 px-6 py-2">
          <div className="w-5 h-5 mr-3 text-gray-400 shrink-0 flex items-center justify-center">
            {/* Inline SVG: person silhouette on left, two sound/wave curves on right (first smaller) */}
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {/* larger person + two parenthesis-like waves (waves moved up/right) */}
              {/* head (slightly bigger, shifted) */}
              <circle cx="9" cy="10.5" r="3.6" />
              {/* shoulders/body (slightly larger) */}
              <path d="M3 19.5c0-3 4-4.3 7-4.3s7 1.3 7 4.3" />
              {/* small parenthesis-style curved mark (moved up & right, larger) */}
              <path d="M17.6 9.6c1.2 1.3 1.2 3.4 0 4.6" />
              {/* larger parenthesis-style curved mark (moved up & right, larger) */}
              <path d="M20.6 8.4c2.0 2.8 2.0 8.2 0 11" />
            </svg>
          </div>
          <div className="relative flex items-center w-full">
            <Select value={jobType} onValueChange={(value) => {
              setJobType(value)
              onJobTypeChange(value)
            }}>
              <SelectTrigger className="w-full h-auto px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 border-0 rounded-none focus:ring-0 shadow-none">
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
              <SelectContent className="z-[70]">
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {jobType && (
              <button
                onClick={() => {
                  setJobType('')
                  onJobTypeChange('')
                }}
                className="p-1 ml-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="h-12 mx-2" />

        {/* Salary Range Filter */}
        <div className="flex-1 px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Salary Per Month</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
              </span>
              {(salaryRange[0] > 1 || salaryRange[1] < maxSalary) && (
                <button
                  onClick={() => {
                    setSalaryRange([1, maxSalary])
                    onSalaryRangeChange([1, maxSalary])
                  }}
                  className="p-1 transition-colors rounded-full hover:bg-gray-100"
                  title="Reset salary range"
                >
                  <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          <Slider
            value={salaryRange}
            onValueChange={(value) => {
              setSalaryRange(value)
              onSalaryRangeChange(value as [number, number])
            }}
            max={maxSalary}
            min={1}
            step={10}
            className="w-full"
          />
        </div>
        
      </div>
    </div>
  )
}
