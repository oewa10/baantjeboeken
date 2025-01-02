'use client'

import { Court } from "@/lib/types/court"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface CourtSlotGridProps {
  court: Court
}

export function CourtSlotGrid({ court }: CourtSlotGridProps) {
  // TODO: Replace with actual availability data
  const slots = [
    { startTime: '09:00', endTime: '10:00', status: 'available' },
    { startTime: '10:00', endTime: '11:00', status: 'booked' },
    { startTime: '11:00', endTime: '12:00', status: 'available' },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">{court.name}</h3>
            <p className="text-sm text-neutral-500">{court.surface} surface</p>
          </div>
          <div className="text-emerald-600 font-semibold">
            €{court.price_per_hour}/hour
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot, i) => (
            <Button
              key={i}
              variant={slot.status === 'available' ? 'default' : 'outline'}
              className="w-full"
              disabled={slot.status === 'booked'}
            >
              {slot.startTime}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
