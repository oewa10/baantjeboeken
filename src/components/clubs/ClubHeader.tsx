'use client'

import { Club } from "@/lib/types/court"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"

interface ClubHeaderProps {
  club: Club
}

export function ClubHeader({ club }: ClubHeaderProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full">
        <Image
          src={club.image || '/pictures/padel-scaled.jpg'}
          alt={club.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-neutral-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{club.city}</span>
              </div>
              {club.rating && (
                <Badge 
                  variant="secondary" 
                  className="bg-yellow-100 text-yellow-800"
                >
                  <Star className="w-3 h-3 fill-yellow-600 mr-1" />
                  {club.rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-emerald-600 font-semibold">
            From €{Math.min(...(club.courts?.map(c => c.price_per_hour) || [0]))}
          </div>
        </div>
      </div>
    </Card>
  )
}
