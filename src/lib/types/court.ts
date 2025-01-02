export interface Location {
  lat: number
  lng: number
}

export interface Club {
  id: string
  name: string
  city: string
  location?: string
  created_at: string
  updated_at: string
}

export interface Facility {
  id: string
  court_id: string
  name: string
}

export interface Court {
  id: string
  name: string
  type: 'indoor' | 'outdoor'
  price_per_hour: number
  club_id: string
  description: string
  city: string
  rating: number
  created_at: string
  updated_at: string
  club?: Club
  facilities?: Facility[]
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
  location?: string
  date?: Date
  minPrice?: number
  maxPrice?: number
  facilities?: string[]
  maxDistance?: number  // in kilometers
}
