'use client'

import { Court } from '@/lib/types/court'
import { Badge } from '@/components/ui/badge'
import { Euro, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CourtCardProps {
  court: Court
}

export function CourtCard({ court }: CourtCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/courts/${court.id}`)
  }

  return (
    <div 
      className="group cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-square relative rounded-xl overflow-hidden mb-3">
        <Image
          src={`/pictures/${court.type === 'indoor' ? 'knltb-padel-comp-091022-alyssa-van-heyst-photography-42.jpg' : 'padel-scaled.jpg'}`}
          alt={court.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Star className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-neutral-900">{court.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-primary-600" />
            <span className="text-sm">{court.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-600">
          <Badge 
            variant="outline" 
            className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
          >
            {court.type}
          </Badge>
          <span className="text-sm">•</span>
          <span className="text-sm">{court.city}</span>
        </div>

        <div className="flex items-center gap-1 text-neutral-900">
          <span className="font-medium">€{court.price_per_hour}</span>
          <span className="text-neutral-600">/hour</span>
        </div>
      </div>
    </div>
  )
}
