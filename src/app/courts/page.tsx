'use client'

import { useEffect, useState } from 'react'
import { Court } from '@/lib/types/court'
import { CourtCard } from '@/components/courts/CourtCard'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([])
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [filters, setFilters] = useState({
    type: [] as string[],
    priceRange: {
      min: 0,
      max: 100
    },
    facilities: [] as string[]
  })

  useEffect(() => {
    async function fetchCourts() {
      try {
        console.log('Fetching courts...')
        const supabase = createClient()
        const { data: courtsData, error: courtsError } = await supabase
          .from('courts')
          .select(`
            *,
            club:clubs(*),
            facilities:court_facilities(*)
          `)

        if (courtsError) throw courtsError
        console.log('Courts data:', courtsData)
        setCourts(courtsData || [])
        setFilteredCourts(courtsData || [])
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch courts')
      } finally {
        setLoading(false)
      }
    }

    fetchCourts()
  }, [])

  useEffect(() => {
    let result = [...courts]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(court => 
        court.name.toLowerCase().includes(query) ||
        court.description.toLowerCase().includes(query)
      )
    }

    if (locationQuery) {
      const location = locationQuery.toLowerCase()
      result = result.filter(court =>
        court.city.toLowerCase().includes(location)
      )
    }

    if (filters.type.length > 0) {
      result = result.filter(court =>
        filters.type.includes(court.type)
      )
    }

    result = result.filter(court =>
      court.price_per_hour >= filters.priceRange.min &&
      court.price_per_hour <= filters.priceRange.max
    )

    if (filters.facilities.length > 0) {
      result = result.filter(court =>
        filters.facilities.every(facility =>
          court.facilities?.some(f => f.name === facility)
        )
      )
    }

    setFilteredCourts(result)
  }, [courts, searchQuery, locationQuery, filters])

  const toggleFilter = (type: 'type' | 'facilities', value: string) => {
    setFilters(prev => {
      const currentArray = prev[type]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return {
        ...prev,
        [type]: newArray
      }
    })
  }

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg">Loading courts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-primary-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-900/90 z-10" />
          <img
            src="/pictures/padel-banner.webp"
            alt="Padel Courts"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 text-white">
            Find Your Perfect Court
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Discover and book the best padel courts in your area. Whether you prefer indoor or outdoor,
            we have the perfect court for your game.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-neutral-300 px-4 py-3 shadow-lg hover:shadow-xl transition-shadow">
                <Search className="w-5 h-5 text-neutral-500" />
                <Input 
                  type="text" 
                  placeholder="Search for courts..." 
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-neutral-900 placeholder:text-neutral-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="h-6 w-px bg-neutral-200" />
                <MapPin className="w-5 h-5 text-neutral-500" />
                <Input 
                  type="text" 
                  placeholder="Location" 
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-neutral-900 placeholder:text-neutral-500"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline"
                    className="h-12 w-12 bg-white text-neutral-600 hover:text-neutral-900 shadow-lg hover:shadow-xl transition-all"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Court Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {['indoor', 'outdoor'].map(type => (
                          <Badge
                            key={type}
                            variant={filters.type.includes(type) ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => toggleFilter('type', type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Price Range (€/hour)</h4>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.priceRange.min}
                          onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange.max)}
                          className="w-20"
                        />
                        <span>-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.priceRange.max}
                          onChange={(e) => handlePriceChange(filters.priceRange.min, Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Changing Rooms', 'Showers', 'Equipment Rental', 'Parking', 'Climate Control', 'Professional Lighting'].map(facility => (
                          <Badge
                            key={facility}
                            variant={filters.facilities.includes(facility) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleFilter('facilities', facility)}
                          >
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-semibold text-neutral-900">Available Courts</h2>
            <p className="text-neutral-600 mt-1">
              {filteredCourts.length} {filteredCourts.length === 1 ? 'court' : 'courts'} found
            </p>
          </div>
          <div className="flex gap-2">
            {filters.type.length > 0 && (
              <Badge variant="secondary" className="capitalize">
                {filters.type.join(', ')}
              </Badge>
            )}
            {filters.facilities.length > 0 && (
              <Badge variant="secondary">
                {filters.facilities.length} {filters.facilities.length === 1 ? 'facility' : 'facilities'}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-neutral-500">
              <Search className="w-12 h-12 mb-4 text-neutral-400" />
              <p className="text-lg font-medium">No courts found matching your criteria</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
