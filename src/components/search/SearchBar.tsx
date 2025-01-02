'use client'

import { useState } from "react"
import { DatePicker } from './DatePicker'
import { TimeSelector, type TimeSelection } from './TimeSelector'
import { LocationPicker } from './LocationPicker'
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Search, X } from "lucide-react"
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider"

interface SearchBarProps {
  onSearch: (location: string, date: string, timeSlot: string) => void
  className?: string
  initialLocation?: string
}

export function SearchBar({ onSearch, className, initialLocation }: SearchBarProps) {
  const [date, setDate] = useState<Date>()
  const [timeSelection, setTimeSelection] = useState<TimeSelection>()
  const [location, setLocation] = useState(initialLocation || "")
  const { isLoaded } = useGoogleMaps()

  const handleSearch = () => {
    onSearch(
      location,
      date ? format(date, 'yyyy-MM-dd') : '',
      timeSelection?.type === 'specific'
        ? timeSelection.value as string
        : timeSelection?.value
          ? `${(timeSelection.value as { start: string; end: string }).start}-${(timeSelection.value as { start: string; end: string }).end}`
          : ''
    )
  }

  const clearFilters = () => {
    setLocation("")
    setDate(undefined)
    setTimeSelection(undefined)
    onSearch("", "", "")
  }

  return (
    <div className={cn("flex flex-wrap gap-4 items-end", className)}>
      <div className="flex-[2] min-w-[300px]">
        <label className="text-sm font-medium mb-2 block">Location</label>
        <LocationPicker
          value={location}
          onChange={setLocation}
          initialLocation={initialLocation}
        />
      </div>

      <div className="flex-1 min-w-[240px]">
        <label className="text-sm font-medium mb-2 block">Date</label>
        <DatePicker
          value={date}
          onChange={setDate}
          minDate={new Date()}
        />
      </div>

      <div className="flex-1 min-w-[240px]">
        <label className="text-sm font-medium mb-2 block">Time</label>
        <TimeSelector
          value={timeSelection}
          onChange={setTimeSelection}
        />
      </div>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 min-w-[120px]"
        >
          <Search className="h-5 w-5" />
          Search
        </button>

        <button
          onClick={clearFilters}
          className="px-4 py-3 bg-white border rounded-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center gap-2 text-gray-600 hover:text-gray-800 min-w-[120px]"
        >
          <X className="h-5 w-5" />
          Clear Filters
        </button>
      </div>
    </div>
  )
}
