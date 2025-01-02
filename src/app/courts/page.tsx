'use client'

import { useEffect, useState } from 'react'
import { Court } from '@/lib/types/court'
import { CourtCard } from '@/components/courts/CourtCard'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourts() {
      try {
        console.log('Fetching courts...')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('courts')
          .select('*')

        if (error) throw error
        console.log('Courts data:', data)
        setCourts(data || [])
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch courts')
      } finally {
        setLoading(false)
      }
    }

    fetchCourts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading courts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-neutral-300 px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
              <Search className="w-5 h-5 text-neutral-500" />
              <Input 
                type="text" 
                placeholder="Search for courts..." 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
              <div className="h-6 w-px bg-neutral-200" />
              <MapPin className="w-5 h-5 text-neutral-500" />
              <Input 
                type="text" 
                placeholder="Location" 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-semibold text-neutral-900">Available Courts</h1>
          <p className="text-neutral-600">{courts.length} courts found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-neutral-500">
              No courts available in this area
            </div>
          ) : (
            courts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
