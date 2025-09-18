import { useState, useEffect, useCallback } from 'react'

interface ScrollBehaviorOptions {
  scrollThreshold?: number
  hideThreshold?: number
  minScrollDifference?: number
  debounceMs?: number
}

interface ScrollState {
  isScrolled: boolean
  isScrollingDown: boolean
  scrollY: number
}

export const useScrollBehavior = (options: ScrollBehaviorOptions = {}) => {
  const {
    scrollThreshold = 100,
    hideThreshold = 200,
    minScrollDifference = 5,
    debounceMs = 16 // ~60fps
  } = options

  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolled: false,
    isScrollingDown: false,
    scrollY: 0
  })

  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const isMobile = window.innerWidth < 768
    
    // Ajustar thresholds para móvil - más estrictos
    const currentScrollThreshold = isMobile ? scrollThreshold * 0.8 : scrollThreshold
    const currentHideThreshold = isMobile ? 100 : hideThreshold // Más bajo para móvil
    const currentMinScrollDifference = isMobile ? 8 : minScrollDifference // Más alto para móvil
    
    const scrollDirection = scrollY > lastScrollY
    const scrollDifference = Math.abs(scrollY - lastScrollY)
    
    // Solo marcar como scrolled si realmente hemos hecho scroll significativo
    const isScrolled = scrollY > currentScrollThreshold
    
    // Lógica muy estricta para ocultar/mostrar el header:
    // Solo ocultar si estamos scrolleando hacia abajo Y hemos pasado un threshold significativo
    // Solo mostrar si estamos muy cerca del top (scrollY < 5) O scrolleando hacia arriba con diferencia significativa
    const shouldHide = scrollDirection && 
                     scrollY > currentHideThreshold && 
                     scrollDifference > currentMinScrollDifference
    
    // Solo mostrar el header si estamos muy cerca del top O scrolleando hacia arriba con diferencia significativa
    const shouldShow = scrollY < 5 || (!scrollDirection && scrollDifference > currentMinScrollDifference && scrollY > 20)

    setScrollState({
      isScrolled,
      isScrollingDown: shouldHide && !shouldShow,
      scrollY
    })
    
    setLastScrollY(scrollY)
  }, [lastScrollY, scrollThreshold, hideThreshold, minScrollDifference])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    
    const debouncedHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        handleScroll()
      }, debounceMs)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', debouncedHandleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', debouncedHandleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [handleScroll, debounceMs])

  return scrollState
}

// Hook específico para el header
export const useHeaderScroll = () => {
  return useScrollBehavior({
    scrollThreshold: 80,   // Cuando empezar a mostrar estado "scrolled"
    hideThreshold: 150,    // Cuando empezar a ocultar el header
    minScrollDifference: 10, // Diferencia mínima de scroll para activar (más estricto)
    debounceMs: 16         // ~60fps para suavidad
  })
}
