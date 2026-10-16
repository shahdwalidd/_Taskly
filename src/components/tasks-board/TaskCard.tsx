import type { TaskCardState, TaskStatusValue } from '@/types/addTask.types'
import { cn } from '@/utils/cn'
import { TaskCardFooter } from './TaskCardFooter'
import { TaskCardStatusPill } from './TaskCardStatusPill'

export interface TaskCardProps {
	code: string
	title: string
	statusId: TaskStatusValue
	state: TaskCardState
	dateLabel?: string
	assigneeName?: string
}

export function TaskCard({
	code,
	title,
	statusId,
	state,
	dateLabel,
	assigneeName,
}: TaskCardProps) {
	return (
		<article
			className={cn(
				'shadow-button flex flex-col rounded-md border p-4',
				state === 'delayed'
					? 'border-error/20 bg-error/5'
					: 'border-surface-low bg-authcard',
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<span className="text-overlay-gray text-[10px] leading-4 font-medium tracking-wide uppercase">
					{code}
				</span>
				<TaskCardStatusPill statusId={statusId} />
			</div>

			<h3
				className={cn(
					'mt-3 text-sm leading-5 font-medium',
					state === 'completed'
						? 'text-slate-medium line-through'
						: 'text-slate-dark',
				)}
			>
				{title}
			</h3>

			<TaskCardFooter
				state={state}
				dateLabel={dateLabel}
				assigneeName={assigneeName}
			/>
		</article>
	)
}
