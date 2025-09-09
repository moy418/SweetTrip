import React, { useEffect } from 'react'

interface PerformanceData {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV === 'development') {
      const measurePerformance = () => {
        const performanceData: PerformanceData = {
          loadTime: performance.now(),
          domContentLoaded: 0
        }

        // Measure DOM Content Loaded
        if (document.readyState === 'complete') {
          performanceData.domContentLoaded = performance.now()
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            performanceData.domContentLoaded = performance.now()
          })
        }

        // Measure Core Web Vitals if available
        if ('PerformanceObserver' in window) {
          try {
            // First Contentful Paint
            new PerformanceObserver((list) => {
              const entries = list.getEntries()
              entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                  performanceData.firstContentfulPaint = entry.startTime
                }
              })
            }).observe({ entryTypes: ['paint'] })

            // Largest Contentful Paint
            new PerformanceObserver((list) => {
              const entries = list.getEntries()
              entries.forEach((entry) => {
                performanceData.largestContentfulPaint = entry.startTime
              })
            }).observe({ entryTypes: ['largest-contentful-paint'] })
          } catch (error) {
            console.warn('Performance monitoring not supported:', error)
          }
        }

        // Log performance data after 5 seconds
        setTimeout(() => {
          console.group('🚀 Performance Metrics')
          console.log('Load Time:', `${performanceData.loadTime.toFixed(2)}ms`)
          console.log('DOM Content Loaded:', `${performanceData.domContentLoaded.toFixed(2)}ms`)
          if (performanceData.firstContentfulPaint) {
            console.log('First Contentful Paint:', `${performanceData.firstContentfulPaint.toFixed(2)}ms`)
          }
          if (performanceData.largestContentfulPaint) {
            console.log('Largest Contentful Paint:', `${performanceData.largestContentfulPaint.toFixed(2)}ms`)
          }
          console.groupEnd()
        }, 5000)
      }

      measurePerformance()
    }
  }, [])

  return null
}