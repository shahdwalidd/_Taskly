import NoTasksIcon from '@/assets/NoTasksIcon.svg?react'

export type AnalyticsStatus = 'TO_DO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'

export interface DayStatusCount {
  status: AnalyticsStatus
  count: number
}

export interface WeekDay {
  weekday: string
  date: string
  isToday?: boolean
  statuses: DayStatusCount[]
}

interface WeeklyCalendarProps {
  desktopDays: WeekDay[]
  mobileDays: WeekDay[]
}

const statusLabel: Record<AnalyticsStatus, string> = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  DONE: 'Done',
}

const desktopStatusStyle: Record<AnalyticsStatus, string> = {
  TO_DO: 'bg-background text-slate-medium',
  IN_PROGRESS: 'bg-primary-container/10 text-primary',
  BLOCKED: 'bg-babyred/20 text-error',
  DONE: 'bg-on-success/10 text-on-success',
}

const mobileStatusStyle: Record<AnalyticsStatus, string> = {
  TO_DO: 'bg-surface-highest text-slate-dark',
  IN_PROGRESS: 'bg-primary-container text-white',
  BLOCKED: 'bg-babyred text-error',
  DONE: 'bg-success text-on-success',
}

function DesktopCalendar({ days }: { days: WeekDay[] }) {
  return (
    <div className="hidden grid-cols-7 gap-3 md:grid">
      {days.map((day) => (
        <article
          key={`${day.weekday}-${day.date}`}
          aria-label={`${day.weekday} ${day.date}${day.isToday ? ', today' : ''}`}
          className={`relative flex min-h-105 flex-col rounded-lg bg-white p-4 shadow-sm ${day.isToday ? 'border-2 border-primary' : ''}`}
        >
          {day.isToday && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-label-xs leading-3 font-bold tracking-wide text-white uppercase">
              Today
            </span>
          )}
          <div className="flex flex-col">
            <span className={`text-xs leading-4 font-bold uppercase ${day.isToday ? 'text-primary' : 'text-slate-medium/50'}`}>
              {day.weekday}
            </span>
            <span className={`text-lg leading-7 font-bold ${day.isToday ? 'text-primary' : day.statuses.length === 0 ? 'text-slate-dark/60' : 'text-slate-dark'}`}>
              {day.date}
            </span>
          </div>
          {day.statuses.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {day.statuses.map(({ status, count }) => (
                <li key={status} className={`flex min-h-8 items-center justify-between gap-2 rounded-sm px-2 text-label-xs leading-4 font-bold uppercase ${desktopStatusStyle[status]} ${day.isToday && status === 'IN_PROGRESS' ? 'border-l-4 border-primary bg-primary-container/20 pl-1.5' : ''}`}>
                  <span>{statusLabel[status]}</span>
                  <span className="text-slate-dark">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-slate-light">
              <NoTasksIcon aria-hidden="true" />
              <span className="text-label-xs font-bold tracking-wide uppercase">No Tasks</span>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function MobileCalendar({ days }: { days: WeekDay[] }) {
  return (
    <div className="flex flex-col gap-2 pr-1 pb-analytics-calendar-tail md:hidden">
      {days.map((day) => (
        <article
          key={`${day.weekday}-${day.date}`}
          aria-label={`${day.weekday} ${day.date}${day.isToday ? ', today' : ''}`}
          className={`flex min-h-13 items-center gap-4 rounded-lg p-3 ${day.statuses.length === 0 || day.isToday ? 'bg-white' : 'bg-surface-low'} ${day.isToday ? 'border border-primary/20 border-l-4 border-l-primary-container shadow-sm' : ''}`}
        >
          <div className="flex w-12 shrink-0 items-center border-r border-slate-light/40">
            <div className="flex flex-col">
              <span className={`text-analytics-day-label uppercase ${day.isToday ? 'text-primary-container' : 'text-slate-medium'}`}>
                {day.weekday}
              </span>
              <span className={`text-lg leading-5 font-bold ${day.isToday ? 'text-primary-container' : 'text-slate-dark'}`}>
                {day.date}
              </span>
            </div>
          </div>
          <ul className="flex flex-1 items-center gap-2" aria-label="Tasks by status">
            {day.statuses.map(({ status, count }) => (
              <li key={status} className={`flex size-6 items-center justify-center rounded-sm text-xs leading-4 font-bold ${mobileStatusStyle[status]}`}>
                {count}
              </li>
            ))}
          </ul>
          {day.isToday && (
            <span className="rounded-full bg-primary-container px-2.5 py-1 text-label-xs leading-3 font-bold text-white uppercase">
              Today
            </span>
          )}
        </article>
      ))}
    </div>
  )
}

export function WeeklyCalendar({ desktopDays, mobileDays }: WeeklyCalendarProps) {
  return (
    <section aria-labelledby="calendar-title" className="flex flex-col gap-3 md:gap-4">
      <h2 id="calendar-title" className="px-1 text-lg leading-7 font-bold text-slate-dark md:hidden">
        Calendar
      </h2>
      <DesktopCalendar days={desktopDays} />
      <MobileCalendar days={mobileDays} />
    </section>
  )
}

