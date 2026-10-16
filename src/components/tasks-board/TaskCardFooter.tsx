import AlertTriangleIcon from '@/assets/AlertTriangleIcon.svg?react'
import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import CheckCircleIcon from '@/assets/CheckCircleIcon.svg?react'
import type { TaskCardState } from '@/types/addTask.types'
import { TaskAvatar } from './TaskAvatar'

interface TaskCardFooterProps {
	state: TaskCardState
	dateLabel?: string
	assigneeName?: string
}

const stateMeta = {
	default: { Icon: CalendarIcon, label: undefined, className: 'text-overlay-gray' },
	today: { Icon: CalendarIcon, label: 'Today', className: 'text-primary' },
	delayed: { Icon: AlertTriangleIcon, label: 'Delayed', className: 'text-error' },
	completed: { Icon: CheckCircleIcon, label: 'Completed', className: 'text-darkgreen' },
} as const

export function TaskCardFooter({
	state,
	dateLabel,
	assigneeName,
}: TaskCardFooterProps) {
	const { Icon, label, className } = stateMeta[state]
	const text = label ?? dateLabel

	return (
		<div className="mt-3.5 flex min-h-5 items-center justify-between gap-2">
			{text && (
				<p
					className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase ${className}`}
				>
					<Icon aria-hidden="true" className="size-3 shrink-0" />
					{text}
				</p>
			)}

			{assigneeName && (
				<span className="ml-auto">
					<TaskAvatar name={assigneeName} highlighted={state === 'today'} />
				</span>
			)}
		</div>
	)
}
