'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation2 } from "lucide-react"
import { getGoogleMapsUrl } from "@/lib/utils/maps"

interface MapLocationProps {
  location?: string
}

export function MapLocation({ location }: MapLocationProps) {
  if (!location) return null

  const handleRouteClick = () => {
    window.open(getGoogleMapsUrl(location), '_blank')
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Location</h3>
      <div className="h-48 bg-neutral-100 rounded-lg mb-4">
        {/* TODO: Add Google Maps integration */}
        <div className="h-full flex items-center justify-center text-neutral-500">
          Map view coming soon
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleRouteClick}
      >
        <Navigation2 className="w-4 h-4 mr-2" />
        Get Directions
      </Button>
    </Card>
  )
}
