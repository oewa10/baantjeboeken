'use client'

import { SearchHero, SearchParams } from "@/components/home/SearchHero"
import { FeaturedClubs } from "@/components/home/FeaturedClubs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Club } from "@/lib/types/court"

export default function Home() {
  const router = useRouter()
  const [featuredClubs, setFeaturedClubs] = useState<Club[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchClubs = async () => {
      const { data } = await supabase
        .from('clubs')
        .select(`
          id,
          name,
          city,
          location,
          created_at,
          updated_at,
          courts (
            id,
            name,
            type,
            price_per_hour,
            rating,
            description,
            city,
            created_at,
            updated_at,
            court_facilities (
              id,
              court_id,
              name
            )
          )
        `)
        .limit(6)
      setFeaturedClubs(data as Club[] || [])
    }
    fetchClubs()
  }, [])

  const handleSearch = ({ location, date, timeSlot }: SearchParams) => {
    const params = new URLSearchParams({
      location,
      date: date.toISOString(),
      timeSlot
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <SearchHero
          title="Find and Book Paddle Courts"
          subtitle="Discover and reserve the best paddle courts near you"
          backgroundImage="/pictures/padel-scaled.jpg"
          onSearch={handleSearch}
        />
        <div className="mt-32">
          <FeaturedClubs clubs={featuredClubs} />
        </div>
      </main>
    </div>
  )
}
