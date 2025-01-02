'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"

export interface SearchParams {
  location: string;
  date: Date;
  timeSlot: string;
}

interface SearchHeroProps {
  backgroundImage?: string;
  title: string;
  subtitle?: string;
  onSearch: (params: SearchParams) => void;
}

export function SearchHero({ backgroundImage, title, subtitle, onSearch }: SearchHeroProps) {
  const [date, setDate] = useState<Date>()
  const [location, setLocation] = useState("")
  const [timeSlot, setTimeSlot] = useState("")

  const handleSearch = () => {
    if (date && location && timeSlot) {
      onSearch({ location, date, timeSlot })
    }
  }

  return (
    <div 
      className="relative w-full min-h-[60vh] flex items-center justify-center p-6"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">{title}</h1>
        {subtitle && <p className="text-lg text-white/90">{subtitle}</p>}
      </div>

      <Card className="w-full max-w-3xl p-6 absolute -bottom-16">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full md:w-[240px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8-12)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12-17)</SelectItem>
              <SelectItem value="evening">Evening (17-22)</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="w-full md:w-auto"
            onClick={handleSearch}
            disabled={!date || !location || !timeSlot}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </Card>
    </div>
  )
}
