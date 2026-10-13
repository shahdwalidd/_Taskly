import CloseIcon from '@/assets/CloseIcon (2).svg?react'
import { EpicDateValue } from './EpicDateValue'

interface EpicDeadlineFieldProps {
  value: string
  displayDate?: string
  onChange: (value: string | null) => void
}

export function EpicDeadlineField({
  value,
  displayDate,
  onChange,
}: EpicDeadlineFieldProps) {
  return (
    <div className="relative">
      <EpicDateValue date={displayDate} withChevron={!value} />

      <input
        type="date"
        aria-label="Deadline"
        value={value}
        onChange={(event) => onChange(event.target.value || null)}
        onClick={(event) => {
          try {
            event.currentTarget.showPicker?.()
          } catch {
            // The browser's native click behavior still opens the picker.
          }
        }}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />

      {value && (
        <button
          type="button"
          aria-label="Clear deadline"
          onClick={() => onChange(null)}
          className="text-slate-medium absolute top-1/2 right-2.5 z-10 -translate-y-1/2 cursor-pointer"
        >
          <CloseIcon aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </div>
  )
}