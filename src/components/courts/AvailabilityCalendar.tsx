'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { addDays, format, isSameDay, startOfToday } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AvailabilityCalendarProps {
  courtId: string
}

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00'
]

export function AvailabilityCalendar({ courtId }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('bookings')
        .insert({
          court_id: courtId,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time_slot: selectedTime,
          user_id: 'user123' // TODO: Replace with actual user ID
        })

      if (error) throw error
      alert('Booking successful!')
    } catch (error) {
      console.error('Error booking court:', error)
      alert('Failed to book court')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={{ before: startOfToday() }}
        className="rounded-md border shadow-sm"
      />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-900">Available time slots</h3>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time
            return (
              <Button
                key={time}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'text-sm py-2 h-auto',
                  isSelected && 'bg-primary-600 text-white hover:bg-primary-700',
                  !isSelected && 'hover:border-primary-600 hover:text-primary-600'
                )}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
