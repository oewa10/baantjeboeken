'use client'

import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface FilterSidebarProps {
  initialFilters: {
    facilities: string[]
    rating: number
    maxRange: number
    location: string
  }
  onFiltersChange: (filters: {
    facilities: string[]
    rating: number
    maxRange: number
    location: string
  }) => void
}

export function FilterSidebar({
  initialFilters,
  onFiltersChange,
}: FilterSidebarProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleFacilityChange = (facility: string) => {
    const newFacilities = initialFilters.facilities.includes(facility)
      ? initialFilters.facilities.filter((f) => f !== facility)
      : [...initialFilters.facilities, facility]

    onFiltersChange({
      ...initialFilters,
      facilities: newFacilities,
    })
  }

  const handleRatingChange = (value: number) => {
    onFiltersChange({
      ...initialFilters,
      rating: value
    })
  }

  const handleRangeChange = (value: number[]) => {
    onFiltersChange({
      ...initialFilters,
      maxRange: value[0]
    })
  }

  const handleLocationChange = (location: string) => {
    onFiltersChange({
      ...initialFilters,
      location
    })
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          )
          const data = await response.json()
          if (data.results[0]) {
            handleLocationChange(data.results[0].formatted_address)
          }
        } catch (error) {
          console.error('Error getting location:', error)
          alert('Could not get your location. Please try again.')
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Could not get your location. Please try again.')
        setIsGettingLocation(false)
      }
    )
  }

  const clearFilters = () => {
    onFiltersChange({
      facilities: [],
      rating: 0,
      maxRange: 0,
      location: '',
    })
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            className="text-sm text-neutral-600 hover:text-neutral-900"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>

        <div className="space-y-8">
          {/* Maximum Range */}
          <div className="space-y-2">
            <Label>Maximum range (km)</Label>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[initialFilters.maxRange]}
              onValueChange={handleRangeChange}
            />
            <div className="flex justify-between text-sm text-neutral-600">
              <span>{initialFilters.maxRange === 0 ? 'Any' : `${initialFilters.maxRange}km`}</span>
              <span>100km</span>
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Minimum rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 4.5].map((rating) => (
                <Button
                  key={rating}
                  variant={initialFilters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRatingChange(rating)}
                  className="flex-1"
                >
                  {rating}<Star className="w-3 h-3 ml-1 fill-current" />
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Facilities */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Facilities</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'changing_rooms', label: 'Changing Rooms' },
                { id: 'parking', label: 'Parking' },
                { id: 'restaurant', label: 'Restaurant' },
                { id: 'equipment_rental', label: 'Equipment Rental' },
                { id: 'padel_shop', label: 'Padel Shop' },
                { id: 'bike_storage', label: 'Bike Storage' },
                { id: 'wheelchair_access', label: 'Wheelchair Access' },
                { id: 'charging_points', label: 'Charging Points' },
              ].map((facility) => (
                <Button
                  key={facility.id}
                  variant={initialFilters.facilities.includes(facility.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFacilityChange(facility.id)}
                  className="justify-start"
                >
                  {facility.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
