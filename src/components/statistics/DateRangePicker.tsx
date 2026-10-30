import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'
import CalendarIcon from '@/assets/statistics/DateCalendar.svg?react'
import PreviousIcon from '@/assets/statistics/WeekPrevious.svg?react'
import NextIcon from '@/assets/statistics/WeekNext.svg?react'
import { countInclusiveDays, formatShortDate, parseIsoDate, toIsoDate } from '@/utils/dateRange'
import type { DateRangeValue } from '@/utils/dateRange'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onApply: (range: DateRangeValue) => void
}

const pickerClasses = {
  root: 'w-full font-sans',
  months: 'w-full',
  month: 'w-full space-y-4',
  month_caption: 'flex h-8 items-center justify-between px-1',
  caption_label: 'text-base leading-6 font-bold text-slate-dark',
  nav: 'flex items-center gap-2',
  button_previous: 'flex size-8 items-center justify-center rounded-sm text-slate-medium hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary',
  button_next: 'flex size-8 items-center justify-center rounded-sm text-slate-medium hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary',
  month_grid: 'w-full border-collapse',
  weekdays: 'grid grid-cols-7',
  weekday: 'h-8 text-center text-label-sm font-bold uppercase text-slate-medium',
  weeks: 'grid gap-y-1',
  week: 'grid grid-cols-7',
  day: 'relative p-0 text-center',
  day_button: 'mx-auto flex size-9 items-center justify-center rounded-sm text-sm font-medium text-slate-dark hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary',
  range_start: 'rounded-l-sm bg-primary-container text-white',
  range_end: 'rounded-r-sm bg-primary-container text-white',
  range_middle: 'rounded-none bg-surface-highest text-slate-dark',
  selected: 'bg-primary-container text-white',
  today: 'font-bold text-primary-container',
  outside: 'text-slate-light',
  disabled: 'cursor-not-allowed text-slate-light opacity-50',
}

export function DateRangePicker({ startDate, endDate, onApply }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftRange, setDraftRange] = useState<DateRange | undefined>()
  const [visibleMonth, setVisibleMonth] = useState(() => parseIsoDate(startDate))
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const selectedRange = isOpen
    ? draftRange
    : { from: parseIsoDate(startDate), to: parseIsoDate(endDate) }
  const rangeLength = draftRange?.from && draftRange.to
    ? countInclusiveDays(draftRange.from, draftRange.to)
    : 0
  const hasValidRange = Boolean(draftRange?.from && draftRange.to && rangeLength <= 7)
  const rangeError = rangeLength > 7
    ? 'Choose no more than 7 calendar days.'
    : draftRange?.from && !draftRange.to
      ? 'Select an end date to complete the range.'
      : null

  const openPicker = () => {
    setDraftRange({ from: parseIsoDate(startDate), to: parseIsoDate(endDate) })
    setVisibleMonth(parseIsoDate(startDate))
    setIsOpen(true)
  }

  const applyRange = () => {
    if (!hasValidRange || !draftRange?.from || !draftRange.to) return
    onApply({ startDate: toIsoDate(draftRange.from), endDate: toIsoDate(draftRange.to) })
    setIsOpen(false)
  }

  return (
    <div ref={pickerRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        className="flex h-11 w-full min-w-0 items-center gap-2 rounded-lg bg-surface-low px-4 text-left text-xs font-bold text-slate-dark shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-container md:h-9 md:rounded-sm md:bg-white md:text-sm"
      >
        <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{formatShortDate(parseIsoDate(startDate))} – {formatShortDate(parseIsoDate(endDate))}</span>
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Select a date range" className="absolute top-full left-0 z-30 mt-2 w-[min(22.5rem,calc(100vw-2rem))] rounded-lg border border-slate-light/30 bg-white p-4 shadow-xl md:w-96 md:p-6">
          <DayPicker
            mode="range"
            resetOnSelect
            selected={selectedRange}
            onSelect={setDraftRange}
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            weekStartsOn={0}
            classNames={pickerClasses}
            components={{
              PreviousMonthButton: (props) => <button {...props} aria-label="Previous month"><PreviousIcon aria-hidden="true" /></button>,
              NextMonthButton: (props) => <button {...props} aria-label="Next month"><NextIcon aria-hidden="true" /></button>,
            }}
          />
          <div className="mt-4 border-t border-slate-light/30 pt-4">
            {rangeError && <p role="alert" className="mb-3 text-xs font-medium text-error">{rangeError}</p>}
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-sm px-4 py-2 text-sm font-medium text-slate-medium hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary">Cancel</button>
              <button type="button" onClick={applyRange} disabled={!hasValidRange} className="rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50">Apply Range</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
