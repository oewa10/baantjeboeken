export interface Location {
  lat: number
  lng: number
}

export interface Court {
  id: number
  name: string
  type: string
  price_per_hour: number
  club_id: number
  description: string
  city: string
  rating: number
  facilities?: CourtFacility[]
  created_at?: string
  updated_at?: string
}

export interface CourtFacility {
  id: number
  court_id: number
  name: string
}

export interface Club {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  facilities: string[]
  booking_url?: string
  created_at?: string
  updated_at?: string
}

export interface Availability {
  id: string
  court_id: string
  start_time: string
  end_time: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface CourtSearchFilters {
  location?: Location
  date?: Date
  minPrice?: number
  maxPrice?: number
  facilities?: string[]
  maxDistance?: number  // in kilometers
}
