import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { AnalyticsCharts } from '@/components/statistics/AnalyticsCharts'
import type { ProjectStatistic, StatusStatistic } from '@/components/statistics/AnalyticsCharts'
import { AnalyticsSummary } from '@/components/statistics/AnalyticsSummary'
import { WeeklyCalendar } from '@/components/statistics/WeeklyCalendar'
import type { WeekDay } from '@/components/statistics/WeeklyCalendar'
import WeekPreviousIcon from '@/assets/statistics/WeekPrevious.svg?react'
import WeekNextIcon from '@/assets/statistics/WeekNext.svg?react'
import DropdownChevronIcon from '@/assets/statistics/DropdownChevron.svg?react'
import DateCalendarIcon from '@/assets/statistics/DateCalendar.svg?react'

const desktopDays: WeekDay[] = [
  { weekday: 'Sun', date: '11 May', statuses: [] },
  { weekday: 'Mon', date: '12 May', statuses: [{ status: 'TO_DO', count: 4 }, { status: 'IN_PROGRESS', count: 2 }] },
  { weekday: 'Tue', date: '13 May', statuses: [{ status: 'IN_PROGRESS', count: 5 }, { status: 'BLOCKED', count: 1 }] },
  { weekday: 'Wed', date: '14 May', isToday: true, statuses: [{ status: 'IN_PROGRESS', count: 6 }, { status: 'DONE', count: 3 }] },
  { weekday: 'Thu', date: '15 May', statuses: [{ status: 'TO_DO', count: 8 }] },
  { weekday: 'Fri', date: '16 May', statuses: [{ status: 'DONE', count: 12 }] },
  { weekday: 'Sat', date: '17 May', statuses: [] },
]

const mobileDays: WeekDay[] = [
  { weekday: 'Sun', date: '22', statuses: [{ status: 'TO_DO', count: 2 }] },
  { weekday: 'Mon', date: '23', isToday: true, statuses: [{ status: 'TO_DO', count: 5 }, { status: 'IN_PROGRESS', count: 2 }, { status: 'DONE', count: 3 }] },
  { weekday: 'Tue', date: '24', statuses: [{ status: 'TO_DO', count: 8 }, { status: 'BLOCKED', count: 1 }] },
  { weekday: 'Wed', date: '25', statuses: [{ status: 'TO_DO', count: 4 }] },
  { weekday: 'Thu', date: '26', statuses: [{ status: 'TO_DO', count: 6 }, { status: 'IN_PROGRESS', count: 1 }] },
  { weekday: 'Fri', date: '27', statuses: [{ status: 'TO_DO', count: 3 }] },
  { weekday: 'Sat', date: '28', statuses: [{ status: 'TO_DO', count: 0 }] },
]

const desktopStatus: StatusStatistic[] = [
  { status: 'IN_PROGRESS', label: 'In Progress', count: 12 },
  { status: 'DONE', label: 'Done', count: 9 },
  { status: 'BLOCKED', label: 'Blocked', count: 3 },
]

const mobileStatus: StatusStatistic[] = [
  { status: 'IN_PROGRESS', label: 'In Progress', count: 12 },
  { status: 'DONE', label: 'Done', count: 6 },
  { status: 'TO_DO', label: 'To Do', count: 6 },
]

const desktopSegments: StatusStatistic[] = [
  { status: 'IN_PROGRESS', label: 'In Progress', count: 12 },
  { status: 'BLOCKED', label: 'Blocked', count: 3 },
  { status: 'DONE', label: 'Done', count: 9 },
]

const mobileSegments: StatusStatistic[] = [
  { status: 'IN_PROGRESS', label: 'In Progress', count: 12 },
  { status: 'TO_DO', label: 'To Do', count: 3 },
  { status: 'BLOCKED', label: 'Blocked', count: 3 },
  { status: 'DONE', label: 'Done', count: 6 },
]

const desktopProjects: ProjectStatistic[] = [
  { name: 'Skyline Residency', taskCount: 45 },
  { name: 'Urban Center Phase 2', taskCount: 28 },
  { name: 'Green Valley Office', taskCount: 12 },
]

const mobileProjects: ProjectStatistic[] = [
  { name: 'Central Park Tower', taskCount: 18 },
  { name: 'Skyline Residences', taskCount: 12 },
  { name: 'Modern Art Museum', taskCount: 8 },
]

function ShiftWeekIcon({ direction }: { direction: 'previous' | 'next' }) {
  const Icon = direction === 'previous' ? WeekPreviousIcon : WeekNextIcon
  return <Icon aria-hidden="true" />
}

function ChevronDown() {
  return <DropdownChevronIcon aria-hidden="true" />
}

function DateIcon() {
  return <DateCalendarIcon aria-hidden="true" />
}

function FilterSelect({ label, className = '', controlClassName = '', children }: { label: string; className?: string; controlClassName?: string; children: React.ReactNode }) {
  return (
    <label className={`relative flex min-w-0 items-center ${className}`}>
      <span className="sr-only">{label}</span>
      <select className={`h-9 w-full appearance-none rounded-lg bg-surface-low py-2 pr-10 pl-4 text-sm font-medium text-slate-dark shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-container md:rounded-sm md:bg-white ${controlClassName}`}>
        {children}
      </select>
      <span className="absolute right-3 flex items-center"><ChevronDown /></span>
    </label>
  )
}

export function StatisticsPage() {
  return (
    <AuthenticatedLayout>
      <div className="flex flex-col gap-6 px-4 pt-4 pb-6 md:gap-8 md:px-8 md:py-8">
        <header className="hidden flex-col gap-0 md:flex">
          <h1 className="text-3xl leading-9 font-bold tracking-tight text-slate-dark">Weekly Planner</h1>
          <p className="text-base leading-6 text-grey">Manage your deadlines and track team velocity.</p>
        </header>

        <section aria-label="Analytics filters" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:rounded-lg md:bg-surface-low md:p-4">
          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-sm p-1 text-grey"><ShiftWeekIcon direction="previous" /></span>
            <span className="text-sm leading-5 font-bold text-slate-dark">May 11 - May 17, 2025</span>
            <span className="rounded-sm p-1 text-grey"><ShiftWeekIcon direction="next" /></span>
          </div>

          <FilterSelect label="Filter by project" className="hidden md:flex md:w-51">
            <option>All Projects</option>
            <option>Skyline Residency</option>
            <option>Urban Center Phase 2</option>
            <option>Green Valley Office</option>
          </FilterSelect>
          <FilterSelect label="Filter by status" className="hidden md:flex md:w-34">
            <option>All Statuses</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Blocked</option>
            <option>Done</option>
          </FilterSelect>

          <FilterSelect label="Filter by project" className="md:hidden" controlClassName="h-11 font-bold md:h-9">
            <option>All Active Projects</option>
            <option>Central Park Tower</option>
            <option>Skyline Residences</option>
            <option>Modern Art Museum</option>
          </FilterSelect>
          <div className="flex gap-2 md:hidden">
            <FilterSelect label="Filter by status" className="w-35 shrink-0" controlClassName="pr-8 text-xs font-bold">
              <option>All Status</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </FilterSelect>
            <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg bg-surface-low px-4 text-xs font-bold text-slate-dark shadow-sm">
              <DateIcon />
              <span className="truncate">Oct 23 - Oct 29</span>
            </div>
          </div>
        </section>

        <section aria-label="Quick overview" className="flex flex-col gap-3 md:gap-0">
          <h2 className="text-analytics-overview text-slate-medium uppercase md:hidden">Quick Overview</h2>
          <AnalyticsSummary
            desktop={{ totalTasks: 24, completedTasks: 15, overdueTasks: 3 }}
            mobile={{ totalTasks: 42, completedTasks: 28, overdueTasks: 5 }}
          />
        </section>

        <WeeklyCalendar desktopDays={desktopDays} mobileDays={mobileDays} />

        <AnalyticsCharts
          desktopStatus={desktopStatus}
          mobileStatus={mobileStatus}
          desktopSegments={desktopSegments}
          mobileSegments={mobileSegments}
          desktopProjects={desktopProjects}
          mobileProjects={mobileProjects}
        />
      </div>
    </AuthenticatedLayout>
  )
}
