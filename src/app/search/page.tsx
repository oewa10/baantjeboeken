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
            courts (*)
          `)

        if (location) {
          query = query.ilike('city', `%${location}%`)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching clubs:', error)
          return
        }

        console.log('Raw clubs data:', data)
        setClubs(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [searchParams])

  const filteredClubs = clubs.filter(club => {
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
      const prices = club.courts?.map(court => court.price_per_hour) || []
      if (!prices.some(price => 
        price >= filters.priceRange[0] && price <= filters.priceRange[1]
      )) {
        return false
      }
    }

    if (filters.rating > 0) {
      const courtRatings = club.courts?.map(court => court.rating || 0) || []
      if (!courtRatings.some(rating => rating >= filters.rating)) {
        return false
      }
    }

    if (filters.facilities.length > 0 && 
        !filters.facilities.every(facility => 
          club.facilities?.includes(facility)
        )) {
      return false
    }

    return true
  })

  const handleSearch = (location: string, date: string, timeSlot: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (location) {
      params.set('location', location)
    } else {
      params.delete('location')
    }
    
    if (date) {
      params.set('date', date)
    } else {
      params.delete('date')
    }
    
    if (timeSlot) {
      params.set('timeSlot', timeSlot)
    } else {
      params.delete('timeSlot')
    }

    const newPath = params.toString() ? `?${params.toString()}` : ''
    router.push(`/search${newPath}`)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <SearchBar 
            defaultLocation={searchParams.get('location') || ''}
            defaultDate={searchParams.get('date') || ''}
            defaultTimeSlot={searchParams.get('timeSlot') || ''}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {filteredClubs.length} {filteredClubs.length === 1 ? 'court' : 'courts'} available
            </h1>
            {searchParams.get('location') && (
              <p className="text-neutral-500 mt-1">
                in {searchParams.get('location')}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] p-0">
                <div className="p-6">
                  <FilterSidebar
                    onFiltersChange={setFilters}
                    initialFilters={filters}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="hidden md:flex"
            >
              {showMap ? 'Hide map' : 'Show map'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr] gap-8">
          <div className="hidden lg:block h-[calc(100vh-200px)] sticky top-[100px]">
            <FilterSidebar
              onFiltersChange={setFilters}
              initialFilters={filters}
            />
          </div>
          
          <div className="space-y-8">
            {showMap && (
              <div className="rounded-xl overflow-hidden">
                <MapView clubs={filteredClubs} className="h-[400px]" />
              </div>
            )}
            {loading ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">Loading courts...</h3>
              </div>
            ) : (
              <ClubGrid clubs={filteredClubs} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
