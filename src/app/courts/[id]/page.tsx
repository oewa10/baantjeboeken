'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Court } from '@/lib/types/court'
import { AvailabilityCalendar } from '@/components/courts/AvailabilityCalendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Euro, MapPin, Star, Clock, Info, Check } from 'lucide-react'
import Image from 'next/image'

export default function CourtPage({ params }: { params: { id: string } }) {
  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourt() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('courts')
          .select(`
            *,
            facilities:court_facilities(*)
          `)
          .eq('id', params.id)
          .single()

        if (error) throw error
        setCourt(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch court')
      } finally {
        setLoading(false)
      }
    }

    fetchCourt()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading court details...</div>
      </div>
    )
  }

  if (error || !court) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'Court not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-neutral-100">
        <Image
          src={`/pictures/${court.type === 'indoor' ? 'knltb-padel-comp-091022-alyssa-van-heyst-photography-42.jpg' : 'padel-scaled.jpg'}`}
          alt={court.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-display font-semibold text-neutral-900">{court.name}</h1>
                  <div className="flex items-center gap-2 text-neutral-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{court.city}, Netherlands</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-primary-600" />
                      <span>{court.rating}</span>
                      <span>(42 reviews)</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-primary-50 text-primary-700 border-primary-200"
                >
                  {court.type}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Opening Hours</p>
                    <p className="text-sm text-neutral-600">9:00 - 22:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50">
                  <Euro className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Price per hour</p>
                    <p className="text-sm text-neutral-600">€{court.price_per_hour}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50">
                  <Info className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Facilities</p>
                    <p className="text-sm text-neutral-600">Lighting, Equipment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-4">About this court</h2>
              <p className="text-neutral-600">
                {court.description}
              </p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-4">Facilities</h2>
              <div className="grid grid-cols-2 gap-4">
                {court.facilities?.map((facility) => (
                  <div key={facility.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-neutral-600">{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold">€{court.price_per_hour}</span>
                    <span className="text-neutral-600">/ hour</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-primary-600" />
                    <span className="font-medium">4.9</span>
                  </div>
                </div>

                <AvailabilityCalendar courtId={court.id} />

                <Button className="w-full" size="lg">
                  Book this court
                </Button>

                <p className="text-center text-sm text-neutral-500">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
