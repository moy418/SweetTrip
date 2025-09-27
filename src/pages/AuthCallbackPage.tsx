import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  console.log('🚀 AuthCallbackPage rendered')
  const navigate = useNavigate()
  const { createSocialProfile } = useAuth()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      console.log('Auth callback already processed, skipping...')
      return
    }

    const handleAuthCallback = async () => {
      try {
        hasProcessed.current = true
        console.log('Processing auth callback...')
        console.log('Current URL:', window.location.href)
        
        // Check if we have tokens in the URL hash
        const hash = window.location.hash
        console.log('URL hash:', hash)
        
        if (hash.includes('access_token')) {
          console.log('Found access_token in URL, processing...')
          
          // The URL has format: #/auth/callback#access_token=...
          // We need to extract the part after the second #
          const hashParts = hash.split('#')
          console.log('Hash parts:', hashParts)
          
          // The tokens are in the last part after the second #
          const tokenPart = hashParts[hashParts.length - 1]
          console.log('Token part:', tokenPart)
          
          // Extract tokens from the token part
          const params = new URLSearchParams(tokenPart)
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          const expiresIn = params.get('expires_in')
          
          console.log('Extracted tokens:', { 
            accessToken: accessToken ? 'present' : 'missing',
            refreshToken: refreshToken ? 'present' : 'missing',
            expiresIn 
          })
          
          console.log('Access token value:', accessToken ? accessToken.substring(0, 50) + '...' : 'null')
          
          if (accessToken) {
            console.log('About to set session with tokens...')
            
            let data, error
            try {
              // Set the session manually using the tokens from the URL with timeout
              const setSessionPromise = supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              })
              
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('setSession timeout')), 5000)
              )
              
              const result = await Promise.race([setSessionPromise, timeoutPromise]) as any
              data = result.data
              error = result.error
              
              console.log('setSession result:', { data, error })
            } catch (setSessionError) {
              console.error('setSession failed or timed out:', setSessionError)
              toast.error('Error estableciendo sesión: ' + setSessionError.message)
              navigate('/login')
              return
            }
            
            if (error) {
              console.error('Error setting session:', error)
              toast.error('Error de autenticación: ' + error.message)
              navigate('/login')
              return
            }
            
            if (data.session && data.session.user) {
              console.log('Session set successfully:', data.session.user.email)
              
              // Show success message
              toast.success('¡Bienvenido a tu Pasaporte Sweet Trip!')
              
              // Check if user came from checkout
              const checkoutRedirect = sessionStorage.getItem('checkout_redirect')
              if (checkoutRedirect) {
                sessionStorage.removeItem('checkout_redirect')
                console.log('Navigating to /checkout with replace: true')
                navigate('/checkout', { replace: true })
              } else {
                console.log('Navigating to / with replace: true')
                navigate('/', { replace: true })
              }
              
              // Force navigation after a short delay if navigate doesn't work
              setTimeout(() => {
                console.log('Force navigating to / after timeout')
                window.location.href = '/'
              }, 1000)
              
              return
            }
          }
        }
        
        // Fallback: try to get existing session
        console.log('No tokens in URL, checking existing session...')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          toast.error('Error de autenticación: ' + error.message)
          navigate('/login')
          return
        }

        if (data.session && data.session.user) {
          console.log('Existing session found:', data.session.user.email)
          
          // Show success message
          toast.success('¡Bienvenido a tu Pasaporte Sweet Trip!')
          
          // Check if user came from checkout
          const checkoutRedirect = sessionStorage.getItem('checkout_redirect')
          if (checkoutRedirect) {
            sessionStorage.removeItem('checkout_redirect')
            console.log('Fallback: Navigating to /checkout with replace: true')
            navigate('/checkout', { replace: true })
          } else {
            console.log('Fallback: Navigating to / with replace: true')
            navigate('/', { replace: true })
          }
          
          // Force navigation after a short delay if navigate doesn't work
          setTimeout(() => {
            console.log('Fallback: Force navigating to / after timeout')
            window.location.href = '/'
          }, 1000)
        } else {
          console.log('No session found')
          toast.error('No se pudo completar la autenticación')
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        hasProcessed.current = false // Reset flag on error
        toast.error('Error inesperado durante la autenticación')
        navigate('/login')
      }
    }

    // Start processing immediately
    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="/sweetlogo-removebg-preview.png" 
            alt="Sweet Trip" 
            className="h-20 w-20 mx-auto rounded-xl shadow-lg animate-pulse"
          />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Completando autenticación...
        </h2>
        <p className="text-gray-600 mb-4">
          Preparando tu Pasaporte Sweet Trip
        </p>
        <div className="text-sm text-gray-500">
          Si esta página no se actualiza automáticamente, 
          <button 
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 underline ml-1"
          >
            haz clic aquí
          </button>
        </div>
      </div>
    </div>
  )
}
