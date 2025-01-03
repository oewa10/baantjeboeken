'use client'

import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface FilterSidebarProps {
  onFiltersChange: (filters: {
    priceRange: [number, number]
    rating: number
    distance: number
    facilities: string[]
  }) => void
  initialFilters: {
    priceRange: [number, number]
    rating: number
    distance: number
    facilities: string[]
  }
}

const facilities = [
  {
    id: 'changing_rooms',
    label: 'Changing Rooms',
    description: 'Includes showers and lockers'
  },
  {
    id: 'parking',
    label: 'Parking',
    description: 'Free or paid parking available'
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    description: 'Restaurant, café, or bar for drinks and snacks'
  },
  {
    id: 'equipment_rental',
    label: 'Equipment Rental',
    description: 'Rent rackets and balls'
  },
  {
    id: 'padel_shop',
    label: 'Padel Shop',
    description: 'Shop for buying equipment'
  },
  {
    id: 'bike_storage',
    label: 'Bike Storage',
    description: 'For cyclists'
  },
  {
    id: 'wheelchair_access',
    label: 'Wheelchair Access',
    description: 'Accessible for people with disabilities'
  },
  {
    id: 'charging_points',
    label: 'Charging Points',
    description: 'For electric cars or bikes'
  }
]

export function FilterSidebar({ onFiltersChange, initialFilters }: FilterSidebarProps) {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...initialFilters,
      priceRange: [value[0], value[1]]
    })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...initialFilters,
      rating
    })
  }

  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({
      ...initialFilters,
      distance: value[0]
    })
  }

  const handleFacilityChange = (facilityId: string, checked: boolean) => {
    const newFacilities = checked
      ? [...initialFilters.facilities, facilityId]
      : initialFilters.facilities.filter(id => id !== facilityId)
    
    onFiltersChange({
      ...initialFilters,
      facilities: newFacilities
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 100],
      rating: 0,
      distance: 25,
      facilities: []
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
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Price per hour</Label>
            <div className="px-2">
              <Slider
                defaultValue={[initialFilters.priceRange[0], initialFilters.priceRange[1]]}
                min={0}
                max={100}
                step={5}
                onValueChange={handlePriceChange}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-neutral-600">
              <span>€{initialFilters.priceRange[0]}</span>
              <span>€{initialFilters.priceRange[1]}</span>
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Minimum rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
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

          {/* Distance */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Maximum distance</Label>
            <div className="px-2">
              <Slider
                defaultValue={[initialFilters.distance]}
                max={50}
                step={5}
                onValueChange={handleDistanceChange}
              />
            </div>
            <div className="mt-2 text-sm text-neutral-600">
              Within {initialFilters.distance}km
            </div>
          </div>

          <Separator />

          {/* Facilities */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Facilities</Label>
            <div className="space-y-3">
              {facilities.map((facility) => (
                <div key={facility.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={facility.id}
                    checked={initialFilters.facilities.includes(facility.id)}
                    onCheckedChange={(checked) => 
                      handleFacilityChange(facility.id, checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={facility.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {facility.label}
                    </label>
                    <p className="text-sm text-neutral-600">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
