'use client'

import { Court } from '@/lib/types/court'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Euro, Navigation2, Star } from 'lucide-react'
import { getGoogleMapsUrl } from '@/lib/utils/maps'

interface CourtCardProps {
  court: Court
}

export function CourtCard({ court }: CourtCardProps) {
  const imageUrl = court.type === 'indoor' 
    ? '/pictures/knltb-padel-comp-091022-alyssa-van-heyst-photography-42.jpg'
    : '/pictures/padel-scaled.jpg'

  const handleRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (court.club?.location) {
      window.open(getGoogleMapsUrl(court.club.location), '_blank');
    }
  };

  return (
    <Link href={`/courts/${court.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={court.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 capitalize bg-white/90"
          >
            {court.type}
          </Badge>
          {court.rating && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 bg-yellow-100/90 text-yellow-800 border-yellow-200"
            >
              <Star className="w-3 h-3 fill-yellow-600 mr-1" />
              {court.rating.toFixed(1)}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">{court.city}</span>
            </div>
            {court.club?.location && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                onClick={handleRouteClick}
              >
                <Navigation2 className="w-4 h-4 mr-1" />
                Route
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold truncate">{court.club?.name}</h3>
              <div className="flex items-center gap-1 text-emerald-600">
                <Euro className="w-4 h-4" />
                <span className="font-semibold">{court.price_per_hour}</span>
                <span className="text-sm text-neutral-500">/hour</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {court.facilities?.slice(0, 2).map((facility) => (
                <Badge 
                  variant="outline" 
                  key={facility.id} 
                  className="text-xs bg-transparent"
                >
                  {facility.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
