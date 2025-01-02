"use client"

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from "react-day-picker"
import type { DayPickerSingleProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = Omit<DayPickerSingleProps, "mode"> & {
  mode?: "single"
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = startOfMonth(currentDate);

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Add the days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selected?.toDateString() === date.toDateString();
      
      days.push(
        <button
          key={day}
          onClick={() => onSelect?.(date)}
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center text-sm",
            isSelected 
              ? "bg-primary-600 text-white hover:bg-primary-700" 
              : isToday 
                ? "bg-primary-100 text-primary-600 hover:bg-primary-200" 
                : "text-neutral-900 hover:bg-neutral-100"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={cn("w-full bg-white p-3", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={previousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button 
          onClick={nextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="w-8 h-8 flex items-center justify-center text-neutral-500 text-[0.8rem] font-normal">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar"

export { Calendar }
