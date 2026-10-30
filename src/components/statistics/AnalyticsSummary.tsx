import type { ReactNode } from 'react'
import TaskSummaryMobileIcon from '@/assets/statistics/TaskSummaryMobile.svg?react'
import TaskSummaryDesktopIcon from '@/assets/statistics/TaskSummaryDesktop.svg?react'
import CompletedSummaryMobileIcon from '@/assets/statistics/CompletedSummaryMobile.svg?react'
import CompletedSummaryDesktopIcon from '@/assets/statistics/CompletedSummaryDesktop.svg?react'
import OverdueSummaryMobileIcon from '@/assets/statistics/OverdueSummaryMobile.svg?react'
import OverdueSummaryDesktopIcon from '@/assets/statistics/OverdueSummaryDesktop.svg?react'

interface AnalyticsSummaryProps {
  desktop: { totalTasks: number; completedTasks: number; overdueTasks: number }
  mobile: { totalTasks: number; completedTasks: number; overdueTasks: number }
}

interface SummaryCardProps {
  label: string
  value: number
  tone: 'blue' | 'green' | 'red'
  icon: ReactNode
}

function SummaryCard({ label, value, tone, icon }: SummaryCardProps) {
  const toneClasses = {
    blue: 'text-primary-container md:bg-primary-container/10',
    green: 'text-on-success md:bg-on-success/10',
    red: 'text-error md:bg-error/5',
  }

  return (
    <article className="flex h-analytics-summary-card w-35 flex-none flex-col items-start rounded-lg border border-slate-light/20 bg-white p-4 shadow-sm md:h-26 md:w-auto md:flex-1 md:flex-row md:items-center md:justify-between md:border-0 md:p-6">
      <div className="order-2 flex flex-col pt-2 md:order-0 md:gap-1 md:pt-0">
        <p className="text-analytics-summary-label text-grey uppercase md:text-xs md:leading-4 md:font-bold md:tracking-wide md:text-slate-dark/60">
          {label}
        </p>
        <p className={`text-xl leading-7 font-bold md:text-3xl md:leading-9 ${tone === 'red' ? 'text-error' : 'text-slate-dark'}`}>
          {value}
        </p>
      </div>
      <span className={`order-1 flex size-4 items-center justify-center rounded-sm bg-transparent md:order-0 md:size-12 ${toneClasses[tone]}`} aria-hidden="true">
        {icon}
      </span>
    </article>
  )
}

function SummaryCards({ totalTasks, completedTasks, overdueTasks, mobile = false }: AnalyticsSummaryProps['desktop'] & { mobile?: boolean }) {
  return (
    <section aria-label="Quick overview" className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
      <SummaryCard
        label="Total Tasks"
        value={totalTasks}
        tone="blue"
        icon={<><TaskSummaryMobileIcon className="md:hidden" /><TaskSummaryDesktopIcon className="hidden md:block" /></>}
      />
      <SummaryCard
        label={mobile ? 'Completed' : 'Completed Tasks'}
        value={completedTasks}
        tone="green"
        icon={<><CompletedSummaryMobileIcon className="md:hidden" /><CompletedSummaryDesktopIcon className="hidden md:block" /></>}
      />
      <SummaryCard
        label={mobile ? 'Overdue' : 'Overdue Tasks'}
        value={overdueTasks}
        tone="red"
        icon={<><OverdueSummaryMobileIcon className="md:hidden" /><OverdueSummaryDesktopIcon className="hidden md:block" /></>}
      />
    </section>
  )
}

export function AnalyticsSummary({ desktop, mobile }: AnalyticsSummaryProps) {
  return (
    <>
      <div className="md:hidden"><SummaryCards {...mobile} mobile /></div>
      <div className="hidden md:block"><SummaryCards {...desktop} /></div>
    </>
  )
}
