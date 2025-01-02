'use client'

import { FilterSidebar } from "@/components/search/FilterSidebar"
import { ClubGrid } from "@/components/search/ClubGrid"
import { MapView } from "@/components/search/MapView"
import { SearchBar } from "@/components/search/SearchBar"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Club } from "@/lib/types/court"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Filters {
  priceRange: [number, number]
  rating: number
  distance: number
  facilities: string[]
}

// Convert filter names to database names
const facilityNameMap: Record<string, string> = {
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
    priceRange: [0, 100],
    rating: 0,
    distance: 25,
    facilities: []
  })

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
            courts (
              id,
              name,
              type,
              price_per_hour,
              rating,
              court_facilities (
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

        // Filter clubs based on facilities
        const filteredClubsData = clubsData.map(club => ({
          ...club,
          courts: club.courts?.map(court => ({
            ...court,
            facilities: court.court_facilities || []
          }))
        })).filter(club => {
          // If no facilities selected, include all clubs
          if (filters.facilities.length === 0) return true

          // Check if any court has all the selected facilities
          return club.courts?.some(court => {
            const courtFacilityNames = new Set(
              court.facilities.map(f => f.name)
            )
            
            console.log('Court facilities for', court.name, ':', Array.from(courtFacilityNames))
            
            const hasAllFacilities = filters.facilities.every(facilityId => {
              const dbName = facilityNameMap[facilityId]
              const hasFacility = courtFacilityNames.has(dbName)
              console.log(`Checking ${facilityId} (${dbName}):`, hasFacility)
              return hasFacility
            })
            
            console.log('Has all facilities:', hasAllFacilities)
            return hasAllFacilities
          })
        })

        setClubs(filteredClubsData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [searchParams, filters])

  const filteredClubs = clubs.filter(club => {
    // Price filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
      const prices = club.courts?.map(court => court.price_per_hour) || []
      if (!prices.some(price => 
        price >= filters.priceRange[0] && price <= filters.priceRange[1]
      )) {
        return false
      }
    }

    // Rating filter
    if (filters.rating > 0) {
      const courtRatings = club.courts?.map(court => court.rating || 0) || []
      if (!courtRatings.some(rating => rating >= filters.rating)) {
        return false
      }
    }

    return true
  })

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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} initialLocation={searchParams.get('location') || ''} />
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
