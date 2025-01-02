'use client'

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ReviewsProps {
  clubId: string
}

export function Reviews({ clubId }: ReviewsProps) {
  // TODO: Implement reviews functionality
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Reviews</h3>
      <div className="text-neutral-500 text-center py-8">
        Reviews coming soon
      </div>
    </Card>
  )
}
