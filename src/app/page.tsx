'use client'

import { SearchHero, SearchParams } from "@/components/home/SearchHero"
import { FeaturedClubs } from "@/components/home/FeaturedClubs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const router = useRouter()
  const [featuredClubs, setFeaturedClubs] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchClubs = async () => {
      const { data } = await supabase
        .from('clubs')
        .select('*')
        .limit(6)
      setFeaturedClubs(data || [])
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
