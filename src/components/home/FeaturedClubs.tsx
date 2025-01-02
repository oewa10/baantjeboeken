'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Club } from "@/lib/types/court"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FeaturedClubsProps {
  clubs: Club[]
}

export function FeaturedClubs({ clubs }: FeaturedClubsProps) {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Featured Clubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Link key={club.id} href={`/clubs/${club.id}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={club.image || '/pictures/padel-scaled.jpg'}
                    alt={club.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {club.rating && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-yellow-100/90 text-yellow-800 border-yellow-200"
                    >
                      <Star className="w-3 h-3 fill-yellow-600 mr-1" />
                      {club.rating.toFixed(1)}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{club.name}</h3>
                  <div className="flex items-center text-neutral-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{club.city}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
