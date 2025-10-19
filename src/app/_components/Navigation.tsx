'use client'

import { useState, useEffect } from 'react'
import { Home, User, Briefcase, FileText, Users, Info, ChevronDown } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import Image from 'next/image'
import { CreateJobModal } from './CreateJobModal'
import { useRouter } from 'next/navigation'

interface NavigationProps {
  onJobCreated?: (job: any) => void
}

export function Navigation({ onJobCreated }: NavigationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Login state
  const [isHovered, setIsHovered] = useState(false) // Hover state
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { auth } = await import('../../lib/api')
      const isAuthenticated = auth.isAuthenticated()
      const user = auth.getUser()
      
      if (isAuthenticated && user) {
        setCurrentUser(user)
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
      }
    }
    
    checkAuthStatus()
  }, [])

  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Find Jobs', url: '/find-jobs', icon: Briefcase },
    { name: 'Find Talent', url: '/find-talent', icon: Users },
    { name: 'About Us', url: '/about-us', icon: Info },
    { name: 'Testimonials', url: '/testimonials', icon: User }
  ]

  const logo = (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-full">
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={48} 
          height={48}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  )

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      // Navigate to login page
      router.push('/login')
    } else {
      setIsModalOpen(true)
    }
  }

  // local dropdown state for user menu
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    const { auth } = await import('../../lib/api')
    auth.logout()
    setIsLoggedIn(false)
    setCurrentUser(null)
    setIsModalOpen(false)
    setShowUserMenu(false)
    router.push('/')
  }

  const actionButtons = (
    <div className="flex items-center gap-3">
      <button
        onClick={handleButtonClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="px-4 py-2 rounded-full font-medium text-sm text-white navitem-gradient hover:opacity-90 hover:scale-105 transition-all duration-200 whitespace-nowrap overflow-hidden relative min-w-[100px] h-[36px] flex items-center justify-center"
      >
        {isLoggedIn ? (
          <span className="block">Create Jobs</span>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <span className={`absolute transition-all duration-200 ease-in-out ${isHovered ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
              Create Jobs
            </span>
            <span className={`absolute transition-all duration-200 ease-in-out ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Login
            </span>
          </div>
        )}
      </button>

      {isLoggedIn && currentUser && (
        <div className="relative">
          <button onClick={() => setShowUserMenu(v => !v)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full text-sm">
            <span className="font-medium text-gray-700">{currentUser.name || currentUser.username || 'User'}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <>
      <NavBar items={navItems} logo={logo} actionButtons={actionButtons} />
      <CreateJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onJobCreated={onJobCreated}
      />
    </>
  )
}
