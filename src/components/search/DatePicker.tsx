'use client'

import React from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'
import { format, addMonths, subMonths, isSameDay, isToday, startOfToday } from 'date-fns'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({ value, onChange, className, minDate, maxDate }: DatePickerProps) {
  const [currentDate, setCurrentDate] = React.useState(value || new Date())
  const [isOpen, setIsOpen] = React.useState(false)

  const ref = useClickOutside(() => setIsOpen(false))

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleDateSelect = (date: Date) => {
    onChange?.(date)
    setIsOpen(false)
  }

  const handleTodayClick = () => {
    const today = startOfToday()
    onChange?.(today)
    setCurrentDate(today)
    setIsOpen(false)
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const getDisplayValue = () => {
    if (!value) return 'Select date'
    return format(value, 'PPP') // e.g., "April 29, 2023"
  }

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">{getDisplayValue()}</span>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={minDate && currentDate.getMonth() === minDate.getMonth()}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={maxDate && currentDate.getMonth() === maxDate.getMonth()}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                i + 1
              )
              const isSelected = value && isSameDay(date, value)
              const isCurrentDay = isToday(date)
              const disabled = isDateDisabled(date)

              return (
                <button
                  key={i + 1}
                  onClick={() => !disabled && handleDateSelect(date)}
                  disabled={disabled}
                  className={cn(
                    'aspect-square flex items-center justify-center rounded-full transition-colors',
                    isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                    !isSelected && !disabled && 'hover:bg-blue-50 hover:text-blue-600',
                    isCurrentDay && !isSelected && 'text-blue-600 font-medium',
                    disabled && 'opacity-50 cursor-not-allowed bg-gray-100'
                  )}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between">
            <button
              onClick={handleTodayClick}
              className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDateDisabled(new Date())}
            >
              Today
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
