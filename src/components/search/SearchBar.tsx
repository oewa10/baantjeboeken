'use client'

import { useState, useRef } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider"
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete"
import { useClickOutside } from "@/hooks/useClickOutside"

interface SearchBarProps {
  onSearch: (location: string, date: string, timeSlot: string) => void
  className?: string
  initialLocation?: string
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
]

export function SearchBar({ onSearch, className, initialLocation }: SearchBarProps) {
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [openCalendar, setOpenCalendar] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [showTimeSuggestions, setShowTimeSuggestions] = useState(false)
  const { isLoaded } = useGoogleMaps()

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'nl' },
      types: ['(cities)']
    },
    defaultValue: initialLocation || ""
  })

  // Location suggestions ref
  const locationSuggestionsRef = useClickOutside(() => {
    setShowLocationSuggestions(false)
  })

  // Time suggestions ref
  const timeSuggestionsRef = useClickOutside(() => {
    setShowTimeSuggestions(false)
  })

  const clearFilters = () => {
    setValue("")
    setDate(undefined)
    setTimeSlot("")
    clearSuggestions()
    setShowLocationSuggestions(false)
    setShowTimeSuggestions(false)
    onSearch("", "", "")
  }

  const handleLocationSelect = (cityName: string) => {
    setValue(cityName, false)
    clearSuggestions()
    setShowLocationSuggestions(false)
    onSearch(cityName, date ? format(date, 'yyyy-MM-dd') : '', timeSlot)
  }

  const handleSearch = () => {
    onSearch(value, date ? format(date, 'yyyy-MM-dd') : '', timeSlot)
  }

  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-end", className)}>
      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-medium">Location</label>
        <div className="relative" ref={locationSuggestionsRef}>
          <Input
            placeholder="Search city..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setShowLocationSuggestions(true)
            }}
            onFocus={() => {
              if (value && status === "OK") {
                setShowLocationSuggestions(true)
              }
            }}
            disabled={!ready}
            className="w-full"
          />
          {showLocationSuggestions && value && status === "OK" && (
            <div className="absolute w-full z-50 bg-white rounded-md border shadow-lg mt-1">
              <ul className="py-2 max-h-60 overflow-auto">
                {data.map(({ place_id, description }) => {
                  const cityName = description.split(',')[0]
                  return (
                    <li
                      key={place_id}
                      className="px-4 py-2 hover:bg-neutral-100 cursor-pointer"
                      onClick={() => handleLocationSelect(cityName)}
                    >
                      {cityName}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Date</label>
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate)
                setOpenCalendar(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Time</label>
        <div className="relative" ref={timeSuggestionsRef}>
          <Input
            placeholder="Select time"
            value={timeSlot}
            onChange={(e) => {
              setTimeSlot(e.target.value)
            }}
            onFocus={() => setShowTimeSuggestions(true)}
            className="w-full"
          />
          {showTimeSuggestions && (
            <div className="absolute w-full z-50 bg-white rounded-md border shadow-lg mt-1">
              <ul className="py-2 max-h-60 overflow-auto">
                {timeSlots.map((time) => (
                  <li
                    key={time}
                    className="px-4 py-2 hover:bg-neutral-100 cursor-pointer"
                    onClick={() => {
                      setTimeSlot(time)
                      setShowTimeSuggestions(false)
                    }}
                  >
                    {time}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1 lg:flex-none">
          Search
        </Button>
        <Button 
          onClick={clearFilters} 
          variant="outline"
          className="flex-1 lg:flex-none"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}
