'use client'

import { Club } from "@/lib/types/court"
import { cn } from "@/lib/utils"
import { useState, useCallback, useEffect } from "react"
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider"

interface MapViewProps {
  clubs: Club[]
  className?: string
}

const defaultCenter = {
  lat: 52.3676,  // Netherlands center
  lng: 4.9041
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
}

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
}

export function MapView({ clubs, className }: MapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const { isLoaded, loadError } = useGoogleMaps()
  const [clubCoordinates, setClubCoordinates] = useState<Map<string, google.maps.LatLngLiteral>>(new Map())
  const geocoder = isLoaded ? new google.maps.Geocoder() : null

  useEffect(() => {
    if (!isLoaded || !geocoder || clubs.length === 0) return

    const geocodeAddresses = async () => {
      const newCoordinates = new Map<string, google.maps.LatLngLiteral>()
      
      for (const club of clubs) {
        if (!club.location) continue
        
        try {
          const result = await geocoder.geocode({ address: club.location })
          if (result.results[0]?.geometry?.location) {
            const location = result.results[0].geometry.location
            newCoordinates.set(club.id, {
              lat: location.lat(),
              lng: location.lng()
            })
          }
        } catch (error) {
          console.error('Geocoding error for club:', club.name, error)
        }
      }
      
      setClubCoordinates(newCoordinates)
    }

    geocodeAddresses()
  }, [clubs, isLoaded, geocoder])

  const onLoad = useCallback((map: google.maps.Map): void => {
    if (clubCoordinates.size > 0) {
      const bounds = new google.maps.LatLngBounds()
      clubCoordinates.forEach((coords) => {
        bounds.extend(coords)
      })
      map.fitBounds(bounds)
    } else {
      map.setCenter(defaultCenter)
      map.setZoom(7)
    }
    
    setMap(map)
  }, [clubCoordinates])

  const onUnmount = useCallback((): void => {
    setMap(null)
  }, [])

  if (loadError) {
    console.error('Map load error:', loadError)
    return (
      <div className={cn(
        "w-full bg-red-50 rounded-lg flex items-center justify-center min-h-[400px]",
        className
      )}>
        <div className="text-red-500">Error loading map</div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={cn(
        "w-full bg-neutral-100 rounded-lg flex items-center justify-center min-h-[400px]",
        className
      )}>
        <div className="text-neutral-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={cn("w-full rounded-lg overflow-hidden min-h-[400px]", className)}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        center={defaultCenter}
        zoom={7}
      >
        {clubs.map(club => {
          const coords = clubCoordinates.get(club.id)
          if (!coords) return null
          
          return (
            <MarkerF
              key={club.id}
              position={coords}
              onClick={() => {
                // TODO: Show club details in a popup
                console.log('Clicked club:', club)
              }}
            />
          )
        })}
      </GoogleMap>
    </div>
  )
}
