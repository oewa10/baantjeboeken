'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FacilityListProps {
  facilities: Array<{
    id: string
    name: string
  }>
}

export function FacilityList({ facilities }: FacilityListProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Facilities</h3>
      <div className="flex flex-wrap gap-2">
        {facilities.map(facility => (
          <Badge 
            key={facility.id}
            variant="outline"
            className="text-xs bg-transparent"
          >
            {facility.name}
          </Badge>
        ))}
      </div>
    </Card>
  )
}
