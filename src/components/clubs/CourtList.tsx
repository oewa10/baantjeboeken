'use client'

import { Court } from "@/lib/types/court"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourtSlotGrid } from "@/components/clubs/CourtSlotGrid"

interface CourtListProps {
  courts: Court[]
}

export function CourtList({ courts }: CourtListProps) {
  const courtTypes = Array.from(new Set(courts.map(court => court.type)))

  return (
    <Card>
      <Tabs defaultValue={courtTypes[0]} className="p-6">
        <TabsList>
          {courtTypes.map(type => (
            <TabsTrigger key={type} value={type} className="capitalize">
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        {courtTypes.map(type => (
          <TabsContent key={type} value={type}>
            <div className="space-y-4">
              {courts
                .filter(court => court.type === type)
                .map(court => (
                  <CourtSlotGrid key={court.id} court={court} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
