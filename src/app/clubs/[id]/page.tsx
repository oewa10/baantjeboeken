import { createClient } from "@/lib/supabase/server"
import { ClubHeader } from "@/components/clubs/ClubHeader"
import { CourtList } from "@/components/clubs/CourtList"
import { FacilityList } from "@/components/clubs/FacilityList"
import { MapLocation } from "@/components/clubs/MapLocation"
import { Reviews } from "@/components/clubs/Reviews"

interface ClubPageProps {
  params: {
    id: string
  }
}

export default async function ClubPage({ params }: ClubPageProps) {
  const supabase = createClient()

  const { data: club } = await supabase
    .from('clubs')
    .select('*, courts(*)')
    .eq('id', params.id)
    .single()

  if (!club) {
    return <div>Club not found</div>
  }

  return (
    <div className="container py-8">
      <ClubHeader club={club} />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mt-8">
        <div className="space-y-8">
          <CourtList courts={club.courts || []} />
          <Reviews clubId={club.id} />
        </div>
        
        <div className="space-y-8">
          <FacilityList facilities={club.facilities || []} />
          <MapLocation location={club.location} />
        </div>
      </div>
    </div>
  )
}
