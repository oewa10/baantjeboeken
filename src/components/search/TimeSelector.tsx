'use client'

import React from 'react'
import { Clock, ChevronDown } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'

export type TimeRange = {
  start: string
  end: string
}

export type TimeSelection = {
  type: 'specific' | 'period'
  value: string | TimeRange
}

interface TimeSelectorProps {
  value?: TimeSelection
  onChange?: (selection: TimeSelection) => void
  className?: string
}

const TIME_PERIODS = [
  { label: 'Morning', range: { start: '09:00', end: '12:00' } },
  { label: 'Afternoon', range: { start: '12:00', end: '16:00' } },
  { label: 'Evening', range: { start: '16:00', end: '22:00' } },
]

const SPECIFIC_TIMES = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9
  return `${hour.toString().padStart(2, '0')}:00`
})

export function TimeSelector({ value, onChange, className }: TimeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectionType, setSelectionType] = React.useState<'specific' | 'period'>(
    value?.type || 'specific'
  )

  const ref = useClickOutside(() => setIsOpen(false))

  const handleSpecificTimeSelect = (time: string) => {
    onChange?.({ type: 'specific', value: time })
    setIsOpen(false)
  }

  const handlePeriodSelect = (period: TimeRange) => {
    onChange?.({ type: 'period', value: period })
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    if (!value) return 'Select time'
    
    if (value.type === 'specific') {
      return value.value as string
    }
    
    const period = value.value as TimeRange
    const label = TIME_PERIODS.find(
      p => p.range.start === period.start && p.range.end === period.end
    )?.label
    return label ? `${label} (${period.start} - ${period.end})` : 'Select time'
  }

  return (
    <div className={className} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">{getDisplayValue()}</span>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-72 bg-white rounded-lg shadow-lg border p-4 z-50">
          <div className="flex gap-2 mb-4">
            <button
              className={`flex-1 py-2 rounded-md transition-colors ${
                selectionType === 'specific'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => setSelectionType('specific')}
            >
              Specific Time
            </button>
            <button
              className={`flex-1 py-2 rounded-md transition-colors ${
                selectionType === 'period'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => setSelectionType('period')}
            >
              Time Period
            </button>
          </div>

          {selectionType === 'specific' ? (
            <div className="grid grid-cols-3 gap-2">
              {SPECIFIC_TIMES.map(time => (
                <button
                  key={time}
                  onClick={() => handleSpecificTimeSelect(time)}
                  className={`p-2 text-center rounded transition-colors ${
                    value?.type === 'specific' && value.value === time
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {TIME_PERIODS.map(period => (
                <button
                  key={period.label}
                  onClick={() => handlePeriodSelect(period.range)}
                  className={`w-full p-3 text-left rounded transition-colors ${
                    value?.type === 'period' &&
                    (value.value as TimeRange).start === period.range.start
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  {period.label} ({period.range.start} - {period.range.end})
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
