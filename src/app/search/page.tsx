'use client'

import { FilterSidebar } from "@/components/search/FilterSidebar"
import { ClubGrid } from "@/components/search/ClubGrid"
import { MapView } from "@/components/search/MapView"
import { SearchBar } from "@/components/search/SearchBar"
import { LocationPicker } from "@/components/search/LocationPicker"
import { DatePicker } from "@/components/search/DatePicker"
import { TimeSelector } from "@/components/search/TimeSelector"
import { Loader2 } from "lucide-react"
import { MapPin } from "lucide-react"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Club } from "@/lib/types/court"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { calculateDistance } from "@/lib/utils/distance"

interface Filters {
  facilities: string[]
  rating: number
  maxRange: number
  location: string
}

// Convert filter names to database names
const facilityNameMap: { [key: string]: string } = {
  'changing_rooms': 'Changing Rooms',
  'parking': 'Parking',
  'restaurant': 'Restaurant',
  'equipment_rental': 'Equipment Rental',
  'padel_shop': 'Padel Shop',
  'bike_storage': 'Bike Storage',
  'wheelchair_access': 'Wheelchair Access',
  'charging_points': 'Charging Points'
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    facilities: [],
    rating: 0,
    maxRange: 0,
    location: ''
  })
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([])
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        const location = searchParams.get('location')
        
        let query = supabase
          .from('clubs')
          .select(`
            id,
            name,
            city,
            location,
            created_at,
            updated_at,
            courts (
              id,
              name,
              type,
              price_per_hour,
              rating,
              description,
              city,
              created_at,
              updated_at,
              court_facilities (
                id,
                court_id,
                name
              )
            )
          `)

        if (location) {
          query = query.ilike('city', `%${location}%`)
        }

        const { data: clubsData, error } = await query

        if (error) {
          console.error('Error fetching clubs:', error)
          return
        }

        console.log('Clubs data:', clubsData)

        setClubs(clubsData as Club[])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [searchParams])

  const applyFilters = (clubs: Club[]) => {
    return clubs.filter(club => {
      // Filter by rating
      if (filters.rating > 0) {
        const highestRatedCourt = club.courts.reduce((max, court) => 
          court.rating > max.rating ? court : max
        , club.courts[0])
        
        if (highestRatedCourt.rating < filters.rating) {
          return false
        }
      }

      // Filter by facilities
      if (filters.facilities.length > 0) {
        // Check if any court has all the selected facilities
        const hasAllFacilities = club.courts.some(court => {
          const courtFacilities = new Set(court.court_facilities?.map(f => f.name) || [])
          return filters.facilities.every(facilityId => {
            const dbName = facilityNameMap[facilityId]
            return courtFacilities.has(dbName)
          })
        })
        
        if (!hasAllFacilities) {
          return false
        }
      }

      // Filter by location and range
      if (filters.location && filters.maxRange > 0 && club.distance) {
        if (club.distance > filters.maxRange) {
          return false
        }
      }

      return true
    })
  }

  useEffect(() => {
    const updateFilteredClubs = async () => {
      setLoading(true)
      const filtered = applyFilters(clubs)
      setFilteredClubs(filtered)
      setLoading(false)
    }

    updateFilteredClubs()
  }, [clubs, filters])

  const handleSearch = (location: string, date: string, timeSlot: string) => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (date) params.set('date', date)
    if (timeSlot) params.set('timeSlot', timeSlot)
    
    router.push(`/search?${params.toString()}`)
  }

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
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
            // Find the city component from the address
            const cityComponent = data.results[0].address_components.find(
              (component: any) => 
                component.types.includes('locality') || 
                component.types.includes('postal_town')
            )
            if (cityComponent) {
              handleSearch(cityComponent.long_name, searchParams.get('date') || '', searchParams.get('time') || '')
            }
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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 flex gap-2 items-center">
              <LocationPicker
                value={searchParams.get('location') || ''}
                onChange={(value) => handleSearch(value, searchParams.get('date') || '', searchParams.get('time') || '')}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="default"
                className="border rounded-full h-10 w-10 p-0 hover:bg-neutral-100"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                ) : (
                  <MapPin className="h-4 w-4 text-neutral-500" />
                )}
              </Button>
            </div>
            <DatePicker
              value={searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined}
              onChange={(value) => handleSearch(searchParams.get('location') || '', value.toISOString(), searchParams.get('time') || '')}
            />
            <TimeSelector
              value={searchParams.get('time') || ''}
              onChange={(value) => handleSearch(searchParams.get('location') || '', searchParams.get('date') || '', value)}
            />
            <Button 
              variant="default"
              size="default"
              className="h-10 rounded-full"
              onClick={() => handleSearch('', '', '')}
            >
              Clear Filters
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Filters - Show in sheet on mobile, sidebar on desktop */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mb-4 lg:hidden">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterSidebar
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <FilterSidebar
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'} found
            </p>
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Loading clubs...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {showMap && (
                <MapView clubs={filteredClubs} className="h-[400px] w-full rounded-lg border" />
              )}
              <ClubGrid clubs={filteredClubs} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
