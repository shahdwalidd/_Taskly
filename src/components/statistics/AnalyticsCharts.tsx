import type { TaskStatusValue } from '@/types/addTask.types'
import type { ProjectTaskCount } from '@/services/StatisticsService'

export interface StatusStatistic {
  status: TaskStatusValue
  label: string
  count: number
}

interface AnalyticsChartsProps {
  statistics: StatusStatistic[]
  statisticsLoading: boolean
  statisticsError: string | null
  totalTasks: number
  projects: ProjectTaskCount[] | null
  projectsLoading: boolean
  projectsError: string | null
  onRetryStatistics: () => void
  onRetryProjects: () => void
}

const statusColor: Record<TaskStatusValue, { dot: string; stroke: string }> = {
  TO_DO: { dot: 'bg-surface-highest', stroke: 'stroke-surface-highest' },
  IN_PROGRESS: { dot: 'bg-primary-container', stroke: 'stroke-primary-container' },
  BLOCKED: { dot: 'bg-error', stroke: 'stroke-error' },
  IN_REVIEW: { dot: 'bg-slate-medium', stroke: 'stroke-slate-medium' },
  READY_FOR_QA: { dot: 'bg-navyblue', stroke: 'stroke-navyblue' },
  REOPENED: { dot: 'bg-darkred', stroke: 'stroke-darkred' },
  READY_FOR_PRODUCTION: { dot: 'bg-darkgreen', stroke: 'stroke-darkgreen' },
  DONE: { dot: 'bg-on-success', stroke: 'stroke-on-success' },
}

function DonutRings({
  segments,
  radius,
  strokeWidth,
}: {
  segments: StatusStatistic[]
  radius: number
  strokeWidth: number
}) {
  const circumference = 2 * Math.PI * radius
  const segmentTotal = segments.reduce((sum, item) => sum + item.count, 0)
  const segmentLengths = segments.map(({ count }) =>
    segmentTotal > 0 ? (count / segmentTotal) * circumference : 0,
  )

  return (
    <>
      <circle cx="90" cy="90" r={radius} fill="none" className="stroke-lightblue" strokeWidth={strokeWidth} />
      {segments.map(({ status }, index) => {
        const dashOffset = segmentLengths
          .slice(0, index)
          .reduce((sum, length) => sum + length, 0)

        return (
          <circle
            key={status}
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            className={statusColor[status].stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLengths[index]} ${circumference}`}
            strokeDashoffset={-dashOffset}
          />
        )
      })}
    </>
  )
}

function StatusCard({ statistics, loading, error, onRetry, totalTasks }: { statistics: StatusStatistic[]; loading: boolean; error: string | null; onRetry: () => void; totalTasks: number }) {
  const hasData = statistics.some((item) => item.count > 0)

  return (
    <article className="rounded-2xl border border-slate-light/20 bg-white p-5 shadow-sm md:min-h-78 md:p-8">
      <h3 className="text-lg leading-7 font-bold text-slate-dark md:hidden">Tasks By Status</h3>
      <h3 className="hidden text-lg leading-7 font-bold text-slate-dark md:block">Tasks by Status</h3>
      {loading ? (
        <div className="flex min-h-45 items-center justify-center text-sm text-slate-medium" role="status">Loading task statistics…</div>
      ) : error ? (
        <div className="flex min-h-45 flex-col items-center justify-center gap-3 text-center" role="alert">
          <p className="text-sm text-error">{error}</p>
          <button type="button" onClick={onRetry} className="rounded-sm px-3 py-2 text-sm font-bold text-primary hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary">Retry</button>
        </div>
      ) : hasData ? (
        <div className="mt-4 flex items-center justify-center gap-6 md:mt-8 md:gap-6">
          <div className="relative size-45 shrink-0" role="img" aria-label={`Task distribution across ${totalTasks} tasks`}>
            <svg viewBox="0 0 180 180" className="size-full rotate-90 md:hidden">
              <DonutRings segments={statistics} radius={85} strokeWidth={10} />
            </svg>
            <svg viewBox="0 0 180 180" className="hidden size-full rotate-90 md:block">
              <DonutRings segments={statistics} radius={72} strokeWidth={28} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span className="text-analytics-donut-total text-slate-dark">{totalTasks}</span>
              <span className="text-analytics-donut-label text-slate-medium/85">Total</span>
            </div>
          </div>
          <ul className="min-w-0 flex-1 space-y-2" aria-label="Task status breakdown">
            {statistics.map(({ status, label, count }) => (
              <li key={status} className="flex min-w-0 items-center gap-2 text-analytics-legend md:gap-3 md:text-xs md:leading-4">
                <span className={`size-2 shrink-0 rounded-full md:size-3 ${statusColor[status].dot}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 font-medium text-slate-medium md:text-xs md:leading-4">
                    <span className="truncate">{label}</span>
                    <span className="text-slate-dark">{count}</span>
                  </div>
                  <div className="mt-1 hidden h-1 rounded-full bg-surface-highest/60 md:block">
                    <span className={`block h-full rounded-full ${statusColor[status].dot}`} style={{ width: `${(count / Math.max(totalTasks, 1)) * 100}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex min-h-45 items-center justify-center text-sm font-medium text-slate-medium" role="status">
          No task statistics for this date range.
        </div>
      )}
    </article>
  )
}

function ProjectsCard({
  projects,
  loading,
  error,
  onRetry,
}: {
  projects: ProjectTaskCount[] | null
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  return (
    <article className="min-h-analytics-project-card rounded-2xl border border-slate-light/20 bg-white p-5 shadow-sm md:h-auto md:min-h-66 md:rounded-lg md:p-8">
      <h3 className="text-lg leading-4 font-bold tracking-wide text-slate-dark md:leading-7 md:tracking-normal">All Projects</h3>
      {loading ? (
        <p role="status" className="mt-6 text-sm text-slate-medium">Loading projects…</p>
      ) : error ? (
        <div className="mt-6 flex flex-col items-start gap-3 text-sm text-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onRetry} className="rounded-sm px-3 py-2 font-bold text-primary hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary">Retry</button>
        </div>
      ) : projects?.length ? (
        <ul className="mt-4 min-h-19 space-y-3 md:mt-6 md:min-h-0 md:space-y-4">
          {projects.map((project) => (
            <li key={project.project_id} className="flex items-center justify-between gap-3 pb-1 text-analytics-project-row md:pb-0 md:text-xs md:leading-4">
              <span className="truncate font-semibold text-slate-medium">{project.project_name}</span>
              <span className="shrink-0 font-bold text-slate-dark">
                {project.tasks_count} {project.tasks_count === 1 ? 'Task' : 'Tasks'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-slate-medium">No project task counts for this date range.</p>
      )}
    </article>
  )
}

export function AnalyticsCharts({ statistics, statisticsLoading, statisticsError, totalTasks, projects, projectsLoading, projectsError, onRetryStatistics, onRetryProjects }: AnalyticsChartsProps) {
  return (
    <section aria-label="Task statistics" className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="px-1 text-lg leading-7 font-bold text-slate-dark md:hidden">Task Statistics</h2>
        <StatusCard statistics={statistics} loading={statisticsLoading} error={statisticsError} onRetry={onRetryStatistics} totalTasks={totalTasks} />
      </div>
      <ProjectsCard projects={projects} loading={projectsLoading} error={projectsError} onRetry={onRetryProjects} />
    </section>
  )
}
