import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = () => {
    const isAuth = sessionStorage.getItem('admin_authenticated')
    const loginTime = sessionStorage.getItem('admin_login_time')
    
    if (!isAuth || !loginTime) {
      setIsAuthenticated(false)
      return
    }

    // Check if session is still valid (24 hours)
    const loginDate = new Date(loginTime)
    const now = new Date()
    const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceLogin > 24) {
      // Session expired
      sessionStorage.removeItem('admin_authenticated')
      sessionStorage.removeItem('admin_login_time')
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    // Will redirect to login
    return null
  }

  // Authenticated, render children
  return <>{children}</>
}
