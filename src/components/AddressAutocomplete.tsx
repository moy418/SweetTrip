import React, { useState, useRef, useEffect } from 'react'
import { MapPin, Loader } from 'lucide-react'

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect: (address: any) => void
  placeholder?: string
  className?: string
  required?: boolean
}

interface AddressSuggestion {
  display_name: string
  components: {
    house_number?: string
    road?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
  lat: string
  lon: string
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Enter address...",
  className = "",
  required = false
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      // Using Nominatim (OpenStreetMap) API - free and no API key required
      // Enhanced query for better US address results
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&countrycodes=us&bounded=1&viewbox=-106.6509,31.6904,-106.2442,31.8759&q=${encodeURIComponent(query + ', El Paso, TX, USA')}`
      )
      
      if (response.ok) {
        const data = await response.json()
        const formattedSuggestions: AddressSuggestion[] = data.map((item: any) => ({
          display_name: item.display_name,
          components: {
            house_number: item.address?.house_number,
            road: item.address?.road,
            city: item.address?.city || item.address?.town || item.address?.village,
            state: item.address?.state,
            postcode: item.address?.postcode,
            country: item.address?.country
          },
          lat: item.lat,
          lon: item.lon
        }))
        setSuggestions(formattedSuggestions)
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    // Debounce the search
    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue)
    }, 300)
    
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    const addressComponents = suggestion.components
    
    // Format the address for display - more comprehensive
    const formattedAddress = [
      addressComponents.house_number,
      addressComponents.road || addressComponents.street
    ].filter(Boolean).join(' ')
    
    onChange(formattedAddress)
    
    // Call the callback with structured address data
    onAddressSelect({
      line1: formattedAddress,
      city: addressComponents.city || addressComponents.town || addressComponents.village || '',
      state: addressComponents.state || addressComponents.state_district || 'TX',
      postal_code: addressComponents.postcode || '',
      country: 'US'
    })
    
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {isLoading && (
          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {[suggestion.components.house_number, suggestion.components.road].filter(Boolean).join(' ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {[
                      suggestion.components.city,
                      suggestion.components.state,
                      suggestion.components.postcode
                    ].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showSuggestions && suggestions.length === 0 && !isLoading && value.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500">
            No addresses found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  )
}
