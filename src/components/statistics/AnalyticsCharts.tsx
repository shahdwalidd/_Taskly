import type { AnalyticsStatus } from '@/components/statistics/WeeklyCalendar'

export interface StatusStatistic {
  status: AnalyticsStatus
  label: string
  count: number
}

export interface ProjectStatistic {
  name: string
  taskCount: number
}

interface AnalyticsChartsProps {
  desktopStatus: StatusStatistic[]
  mobileStatus: StatusStatistic[]
  desktopSegments: StatusStatistic[]
  mobileSegments: StatusStatistic[]
  desktopProjects: ProjectStatistic[]
  mobileProjects: ProjectStatistic[]
}

const statusColor: Record<AnalyticsStatus, string> = {
  TO_DO: 'text-surface-highest',
  IN_PROGRESS: 'text-primary-container',
  BLOCKED: 'text-error',
  DONE: 'text-on-success',
}

const statusStroke: Record<AnalyticsStatus, string> = {
  TO_DO: 'stroke-lightblue',
  IN_PROGRESS: 'stroke-primary-container',
  BLOCKED: 'stroke-error',
  DONE: 'stroke-on-success',
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

  return (
    <>
      <circle cx="90" cy="90" r={radius} fill="none" className="stroke-lightblue" strokeWidth={strokeWidth} />
      {segments.map(({ status, count }, index) => {
        const length = (count / 24) * circumference
        const dashOffset = segments
          .slice(0, index)
          .reduce((sum, item) => sum + (item.count / 24) * circumference, 0)

        return (
          <circle
            key={status}
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            className={statusStroke[status]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${length} ${circumference}`}
            strokeDashoffset={-dashOffset}
          />
        )
      })}
    </>
  )
}

function StatusCard({ statistics, segments, lightDoneDot = false, title }: { statistics: StatusStatistic[]; segments: StatusStatistic[]; lightDoneDot?: boolean; title: string }) {
  const total = statistics.reduce((sum, item) => sum + item.count, 0)
  return (
    <article className="rounded-2xl border border-slate-light/20 bg-white p-5 shadow-sm md:min-h-78 md:p-8">
      <h3 className="text-lg leading-7 font-bold text-slate-dark">{title}</h3>
      <div className="mt-4 flex items-center justify-center gap-6 md:mt-8 md:gap-6">
        <div className="relative size-45 shrink-0" role="img" aria-label={`Task distribution across ${total} tasks`}>
          <svg viewBox="0 0 180 180" className="size-full rotate-90 md:hidden">
            <DonutRings segments={segments} radius={85} strokeWidth={10} />
          </svg>
          <svg viewBox="0 0 180 180" className="hidden size-full rotate-90 md:block">
            <DonutRings segments={segments} radius={72} strokeWidth={28} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-analytics-donut-total text-slate-dark">{total}</span>
            <span className="text-analytics-donut-label text-slate-medium/85">Total</span>
          </div>
        </div>
        <ul className="min-w-0 flex-1 space-y-2" aria-label="Task status breakdown">
          {statistics.map(({ status, label, count }) => (
            <li key={status} className="flex min-w-0 items-center gap-2 md:gap-3 text-analytics-legend md:text-xs md:leading-4">
              <span className={`size-2 shrink-0 rounded-full md:size-3 ${status === 'DONE' && lightDoneDot ? 'bg-bg-emerald-400' : statusColor[status].replace('text-', 'bg-')}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 font-medium text-slate-medium md:text-xs md:leading-4">
                  <span className="truncate">{label}</span>
                  <span className="text-slate-dark">{count}</span>
                </div>
                <div className="mt-1 hidden h-1 rounded-full bg-surface-highest/60 md:block">
                  <span className={`block h-full rounded-full ${statusColor[status].replace('text-', 'bg-')}`} style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function ProjectsCard({ projects, title }: { projects: ProjectStatistic[]; title: string }) {
  return (
    <article className="h-analytics-project-card rounded-2xl border border-slate-light/20 bg-white p-5 shadow-sm md:h-auto md:min-h-66 md:rounded-lg md:p-8">
      <h3 className="text-lg leading-4 font-bold tracking-wide text-slate-dark md:leading-7 md:tracking-normal">{title}</h3>
      <ul className="mt-4 min-h-19 space-y-3 md:mt-6 md:min-h-0 md:space-y-4">
        {projects.map((project) => (
          <li key={project.name} className="flex items-center justify-between gap-3 pb-1 text-analytics-project-row md:pb-0 md:text-xs md:leading-4">
            <span className="truncate font-semibold text-slate-medium">{project.name}</span>
            <span className="shrink-0 font-bold text-slate-dark">
              {project.taskCount} {project.taskCount === 1 ? 'Task' : 'Tasks'}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function AnalyticsCharts({
  desktopStatus,
  mobileStatus,
  desktopSegments,
  mobileSegments,
  desktopProjects,
  mobileProjects,
}: AnalyticsChartsProps) {
  return (
    <section aria-label="Task statistics" className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="px-1 text-lg leading-7 font-bold text-slate-dark md:hidden">Task Statistics</h2>
        <div className="md:hidden"><StatusCard statistics={mobileStatus} segments={mobileSegments} lightDoneDot title="Tasks By Status" /></div>
        <div className="hidden md:block"><StatusCard statistics={desktopStatus} segments={desktopSegments} title="Tasks by Status" /></div>
      </div>
      <div className="md:hidden"><ProjectsCard projects={mobileProjects} title="All Projects" /></div>
      <div className="hidden md:block"><ProjectsCard projects={desktopProjects} title="All Projects" /></div>
    </section>
  )
}
