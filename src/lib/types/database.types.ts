export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          location: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          location?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          location?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      clubs: {
        Row: {
          id: string
          name: string
          location: Json
          facilities: Json[]
          booking_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: Json
          facilities?: Json[]
          booking_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: Json
          facilities?: Json[]
          booking_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
          id: string
          club_id: string
          name: string
          type: string
          price_per_hour: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          name: string
          type: string
          price_per_hour: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          name?: string
          type?: string
          price_per_hour?: number
          created_at?: string
          updated_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          court_id: string
          start_time: string
          end_time: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          court_id: string
          start_time: string
          end_time: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          start_time?: string
          end_time?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      nearby_clubs: {
        Args: {
          search_location: Json
          max_distance_km?: number
        }
        Returns: {
          id: string
          name: string
          location: Json
          facilities: Json[]
          booking_url: string | null
          created_at: string
          updated_at: string
        }[]
      }
    }
  }
}
