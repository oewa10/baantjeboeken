'use client'

import React from 'react'
import { MapPin, Search, X } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'
import usePlacesAutocomplete from 'use-places-autocomplete'

interface LocationPickerProps {
  value?: string
  onChange?: (location: string) => void
  className?: string
  initialLocation?: string
}

export function LocationPicker({
  value,
  onChange,
  className,
  initialLocation
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = useClickOutside(() => setIsOpen(false))

  const {
    ready,
    value: inputValue,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'nl' },
      types: ['(cities)']
    },
    defaultValue: initialLocation || ""
  })

  const handleSelect = (cityName: string) => {
    setValue(cityName, false)
    clearSuggestions()
    setIsOpen(false)
    onChange?.(cityName)
  }

  const handleClear = () => {
    setValue("", false)
    clearSuggestions()
    setIsOpen(false)
    onChange?.("")
  }

  return (
    <div className={cn('relative w-full', className)} ref={ref}>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Enter city..."
          disabled={!ready}
          className="w-full pl-10 pr-10 py-3 bg-white border rounded-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {isOpen && status === "OK" && inputValue && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border overflow-hidden z-50">
          <div className="p-2">
            <div className="text-sm text-gray-500 px-3 py-2">
              Cities
            </div>
            {data.length > 0 ? (
              data.map(({ place_id, description }) => {
                const [city, region] = description.split(',')
                return (
                  <button
                    key={place_id}
                    onClick={() => handleSelect(city)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 rounded-md flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium">{city}</div>
                      <div className="text-sm text-gray-500">{region}</div>
                    </div>
                    <MapPin className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-2 text-gray-500">
                No cities found
              </div>
            )}
          </div>
          
          {/* Use my location option */}
          <div className="border-t">
            <button
              onClick={() => {
                // Handle geolocation here if needed
                setIsOpen(false)
              }}
              className="w-full px-3 py-3 text-left hover:bg-blue-50 flex items-center gap-2 text-blue-600"
            >
              <Search className="h-5 w-5" />
              Use my current location
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
