import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { AnalyticsCharts } from '@/components/statistics/AnalyticsCharts'
import type { StatusStatistic } from '@/components/statistics/AnalyticsCharts'
import { AnalyticsSummary } from '@/components/statistics/AnalyticsSummary'
import { DateRangePicker } from '@/components/statistics/DateRangePicker'
import { WeeklyCalendar } from '@/components/statistics/WeeklyCalendar'
import type { WeekDay } from '@/components/statistics/WeeklyCalendar'
import { ErrorState } from '@/components/shared/ErrorState'
import { useMyStatistics } from '@/hooks/useMyStatistics'
import { taskStatuses } from '@/components/tasks-board/TaskStatus'
import { TASK_STATUS_VALUES } from '@/types/addTask.types'
import type { TaskStatusValue } from '@/types/addTask.types'
import type { CalendarStatsFilters, TasksCalendarStats } from '@/services/StatisticsService'
import { formatShortDate, getCurrentWeekRange, parseIsoDate, toIsoDate } from '@/utils/dateRange'
import DropdownChevronIcon from '@/assets/statistics/DropdownChevron.svg?react'
import WeekPreviousIcon from '@/assets/statistics/WeekPrevious.svg?react'
import WeekNextIcon from '@/assets/statistics/WeekNext.svg?react'

function createCalendarDays(
  startDate: string,
  endDate: string,
  daily: TasksCalendarStats['daily'],
): WeekDay[] {
  const daysByDate = new Map(daily.map((day) => [day.day.slice(0, 10), day]))
  const today = toIsoDate(new Date())
  const days: WeekDay[] = []
  const current = parseIsoDate(startDate)
  const last = parseIsoDate(endDate)

  while (current <= last) {
    const isoDate = toIsoDate(current)
    const apiDay = daysByDate.get(isoDate)
    const statuses = Object.entries(apiDay?.statuses ?? {})
      .filter((entry): entry is [TaskStatusValue, number] =>
        TASK_STATUS_VALUES.includes(entry[0] as TaskStatusValue) &&
        typeof entry[1] === 'number' && entry[1] > 0)
      .map(([status, count]) => ({ status, count }))
    days.push({
      weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(current),
      date: formatShortDate(current),
      dayNumber: String(current.getDate()),
      isToday: isoDate === today,
      statuses,
    })
    current.setDate(current.getDate() + 1)
  }
  return days
}

function getStatusStatistics(totals: TasksCalendarStats['totals']): StatusStatistic[] {
  return taskStatuses
    .map(({ id, label }) => ({ status: id, label, count: totals[id] ?? 0 }))
    .filter((item) => item.count > 0)
}

function FilterSelect({
  label,
  value,
  onChange,
  className,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className: string
  children: ReactNode
}) {
  return (
    <label className={'relative flex min-w-0 items-center ' + className}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="h-11 w-full appearance-none rounded-lg bg-surface-low py-2 pr-10 pl-4 text-xs font-bold text-slate-dark shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-container md:h-9 md:rounded-sm md:bg-white md:text-sm md:font-medium"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 flex items-center">
        <DropdownChevronIcon aria-hidden="true" />
      </span>
    </label>
  )
}

export function StatisticsPage() {
  const [dateRange, setDateRange] = useState(getCurrentWeekRange)
  const [projectId, setProjectId] = useState('')
  const [status, setStatus] = useState<TaskStatusValue | ''>('')
  const filters: CalendarStatsFilters = {
    ...dateRange,
    projectId: projectId || null,
    status: status || null,
  }
  const {
    statistics,
    projectCounts,
    projects,
    retryStatistics,
    retryProjectCounts,
    retryProjects,
  } = useMyStatistics(filters)

  const stats = statistics.status === 'success' ? statistics.data : null
  const calendarDays = stats
    ? createCalendarDays(dateRange.startDate, dateRange.endDate, stats.daily)
    : []
  const statusStatistics = stats ? getStatusStatistics(stats.totals) : []

  const shiftWeek = (days: number) => {
    const start = parseIsoDate(dateRange.startDate)
    const end = parseIsoDate(dateRange.endDate)
    start.setDate(start.getDate() + days)
    end.setDate(end.getDate() + days)
    setDateRange({ startDate: toIsoDate(start), endDate: toIsoDate(end) })
  }

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col gap-6 px-4 pt-4 pb-6 md:gap-8 md:px-8 md:py-8">
        <header className="hidden flex-col gap-0 md:flex">
          <h1 className="text-3xl leading-9 font-bold tracking-tight text-slate-dark">Weekly Planner</h1>
          <p className="text-base leading-6 text-grey">Manage your deadlines and track team velocity.</p>
        </header>

        <section aria-label="Analytics filters" className="relative z-20 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:rounded-lg md:bg-surface-low md:p-4">
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => shiftWeek(-7)}
              aria-label="Previous week"
              className="rounded-sm p-1 text-slate-medium hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary"
            >
              <WeekPreviousIcon aria-hidden="true" />
            </button>
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onApply={setDateRange}
            />
            <button
              type="button"
              onClick={() => shiftWeek(7)}
              aria-label="Next week"
              className="rounded-sm p-1 text-slate-medium hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary"
            >
              <WeekNextIcon aria-hidden="true" />
            </button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <FilterSelect label="Filter by project" value={projectId} onChange={setProjectId} className="w-51">
              <option value="">All Projects</option>
              {projects.status === 'success' && projects.data.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Filter by status" value={status} onChange={(value) => setStatus(value as TaskStatusValue | '')} className="w-34">
              <option value="">All Statuses</option>
              {taskStatuses.map((taskStatus) => (
                <option key={taskStatus.id} value={taskStatus.id}>{taskStatus.label}</option>
              ))}
            </FilterSelect>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            <FilterSelect label="Filter by project" value={projectId} onChange={setProjectId} className="w-full">
              <option value="">All Projects</option>
              {projects.status === 'success' && projects.data.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </FilterSelect>
            <div className="flex min-w-0 gap-2">
              <FilterSelect label="Filter by status" value={status} onChange={(value) => setStatus(value as TaskStatusValue | '')} className="w-35 shrink-0">
                <option value="">All Statuses</option>
                {taskStatuses.map((taskStatus) => (
                  <option key={taskStatus.id} value={taskStatus.id}>{taskStatus.label}</option>
                ))}
              </FilterSelect>
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onApply={setDateRange}
              />
            </div>
          </div>
        </section>

        {projects.status === 'error' && (
          <div role="alert" className="-mt-4 flex items-center gap-3 text-sm text-error md:-mt-6">
            <span>{projects.error}</span>
            <button type="button" onClick={retryProjects} className="font-bold underline">Retry</button>
          </div>
        )}

        <section aria-label="Quick overview" className="flex flex-col gap-3 md:gap-0">
          <h2 className="text-analytics-overview text-slate-medium uppercase md:hidden">Quick Overview</h2>
          <AnalyticsSummary
            desktop={{
              totalTasks: stats?.total_tasks ?? null,
              completedTasks: stats?.done_tasks ?? null,
              overdueTasks: stats?.overdue_tasks ?? null,
            }}
            mobile={{
              totalTasks: stats?.total_tasks ?? null,
              completedTasks: stats?.done_tasks ?? null,
              overdueTasks: stats?.overdue_tasks ?? null,
            }}
          />
        </section>

        {statistics.status === 'loading' && (
          <div role="status" className="rounded-lg bg-white px-5 py-8 text-center text-sm font-medium text-slate-medium shadow-sm">
            Loading calendar statistics…
          </div>
        )}
        {statistics.status === 'error' && (
          <ErrorState message={statistics.error} onRetry={retryStatistics} />
        )}
        {statistics.status === 'success' && (
          <WeeklyCalendar desktopDays={calendarDays} mobileDays={calendarDays} />
        )}

        <AnalyticsCharts
          statistics={statusStatistics}
          statisticsLoading={statistics.status === 'loading'}
          statisticsError={statistics.status === 'error' ? statistics.error : null}
          totalTasks={stats?.total_tasks ?? 0}
          projects={projectCounts.status === 'success' ? projectCounts.data : null}
          projectsLoading={projectCounts.status === 'loading'}
          projectsError={projectCounts.status === 'error' ? projectCounts.error : null}
          onRetryStatistics={retryStatistics}
          onRetryProjects={retryProjectCounts}
        />
      </div>
    </AuthenticatedLayout>
  )
}
