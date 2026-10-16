import type { TaskCardState, TaskStatusValue } from '@/types/addTask.types'
import { cn } from '@/utils/cn'
import { TaskCardFooter } from './TaskCardFooter'
import { TaskCardStatusPill } from './TaskCardStatusPill'

export interface TaskCardProps {
	code?: string
	title: string
	description?: string
	epicName?: string
	statusId: TaskStatusValue
	state: TaskCardState
	dateLabel?: string
	assigneeName?: string
}

export function TaskCard({
	code,
	title,
	description,
	epicName,
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
				{code && (
					<span className="text-overlay-gray min-w-0 truncate text-[10px] leading-4 font-medium tracking-wide uppercase">
						{code}
					</span>
				)}
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
			{description && (
				<p className="text-slate-medium mt-1 line-clamp-2 break-words text-xs leading-4">
					{description}
				</p>
			)}
			{epicName && (
				<p className="text-overlay-gray mt-2 truncate text-[10px] font-medium">
					{epicName}
				</p>
			)}

			<TaskCardFooter
				state={state}
				dateLabel={dateLabel}
				assigneeName={assigneeName}
			/>
		</article>
	)
}
