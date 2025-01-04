'use client'

import { Club } from "@/lib/types/court"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { MapPin, Star, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ClubGridProps {
  clubs: Club[]
}

export function ClubGrid({ clubs }: ClubGridProps) {
  if (!clubs || clubs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No clubs found</h3>
        <p className="text-neutral-500">Try adjusting your filters</p>
      </div>
    )
  }

  const getCourtRatings = (club: Club) => {
    const courtsWithRatings = club.courts?.map(court => ({
      ...court,
      rating: court.rating || 0
    })).filter(court => court.rating > 0) || []
    
    if (courtsWithRatings.length === 0) return { bestCourt: null }
    
    const bestCourt = courtsWithRatings.reduce((a, b) => a.rating > b.rating ? a : b)
    return { bestCourt }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club) => {
        const { bestCourt } = getCourtRatings(club)
        return (
          <Link key={club.id} href={`/clubs/${club.id}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={club.image || '/pictures/padel-scaled.jpg'}
                  alt={club.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {bestCourt && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-black font-medium shadow-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {bestCourt.rating.toFixed(1)}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg truncate">{club.name}</h3>
                  <div className="flex items-center text-neutral-500">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">{club.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">
                    {club.courts?.length || 0} {(club.courts?.length || 0) === 1 ? 'court' : 'courts'}
                  </span>
                  <span className="font-medium text-emerald-600">
                    From €{Math.min(...(club.courts?.map(c => c.price_per_hour || 0) || [0]))}
                  </span>
                </div>

                {bestCourt && (
                  <>
                    <div className="h-[1px] w-full bg-neutral-200" />
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium">
                        <Trophy className="w-4 h-4 text-yellow-400 mr-1.5 flex-shrink-0" />
                        Top Rated Court
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 min-w-0">
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {bestCourt.type}
                          </Badge>
                          <span className="text-neutral-500 truncate">
                            {bestCourt.name.replace(club.name + ' - ', '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
