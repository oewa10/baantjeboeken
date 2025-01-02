'use client'

import { Court } from '@/lib/types/court'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Euro, ExternalLink, Navigation2 } from 'lucide-react'
import { getGoogleMapsUrl } from '@/lib/utils/maps'

interface CourtDetailsProps {
  court: Court
}

export function CourtDetails({ court }: CourtDetailsProps) {
  const handleRouteClick = () => {
    if (court.club?.location) {
      window.open(getGoogleMapsUrl(court.club.location), '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{court.name}</CardTitle>
            <p className="text-muted-foreground">{court.club?.name}</p>
          </div>
          <Badge variant="secondary" className="w-fit">
            {court.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">€{court.pricePerHour} per hour</span>
          </div>
          {court.club?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span>{court.club.location}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-primary-600 hover:text-primary-700"
                onClick={handleRouteClick}
              >
                <Navigation2 className="w-4 h-4 mr-1" />
                Route
              </Button>
            </div>
          )}
        </div>

        {/* Facilities */}
        {court.club?.facilities && court.club.facilities.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Club Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {court.club.facilities.map((facility) => (
                <Badge key={facility} variant="outline">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Booking Link */}
        {court.club?.bookingUrl && (
          <div className="pt-4">
            <Button
              className="w-full"
              onClick={() => window.open(court.club?.bookingUrl, '_blank')}
            >
              Book via Club Website
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
