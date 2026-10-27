import type { TaskCardState, TaskStatusValue } from '@/types/addTask.types'
import type { CSSProperties, ReactNode, Ref } from 'react'
import { cn } from '@/utils/cn'
import { TaskCardFooter } from './TaskCardFooter'
import { TaskCardStatusPill } from './TaskCardStatusPill'

export interface TaskCardProps {
	task?: import('@/types/addTask.types').Task
	onClick?: () => void
	code?: string
	title: string
	description?: string
	epicName?: string
	statusId: TaskStatusValue
	state: TaskCardState
	dateLabel?: string
	assigneeName?: string
	dragHandle?: ReactNode
	cardRef?: Ref<HTMLElement>
	cardStyle?: CSSProperties
	isDragging?: boolean
}

export function TaskCard({
	task,
	onClick,
	code,
	title,
	description,
	epicName,
	statusId,
	state,
	dateLabel,
	assigneeName,
	dragHandle,
	cardRef,
	cardStyle,
	isDragging = false,
}: TaskCardProps) {
	return (
		<article
			ref={cardRef}
			style={cardStyle}
			data-task-id={task?.id}
			role={onClick ? (dragHandle ? 'group' : 'button') : undefined}
			tabIndex={onClick && !dragHandle ? 0 : undefined}
		onClick={onClick}
		onKeyDown={onClick && !dragHandle ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick() } } : undefined}
		aria-label={onClick && dragHandle ? `Task: ${title}` : onClick ? `View task details: ${title}` : undefined}
			className={cn(
				'shadow-button flex flex-col rounded-md border p-4 transition-opacity',
				state === 'delayed'
					? 'border-error/20 bg-error/5'
					: 'border-surface-low bg-authcard',
				isDragging && 'opacity-40',
			)}
		>
			<div className="flex items-center justify-between gap-2">
				{code && (
					<span className="text-overlay-gray min-w-0 truncate text-[10px] leading-4 font-medium tracking-wide uppercase">
						{code}
					</span>
				)}
				<div className="flex shrink-0 items-center gap-2">
					{dragHandle}
					<TaskCardStatusPill statusId={statusId} />
				</div>
			</div>

			<h3 className="mt-3 text-sm leading-5 font-medium">
				{dragHandle && onClick ? (
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation()
							onClick()
						}}
						className={cn(
							'cursor-pointer text-left focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
							state === 'completed'
								? 'text-slate-medium line-through'
								: 'text-slate-dark',
						)}
					>
						{title}
					</button>
				) : (
					<span
						className={cn(
							state === 'completed'
								? 'text-slate-medium line-through'
								: 'text-slate-dark',
						)}
					>
						{title}
					</span>
				)}
			</h3>
			{description && (
				<p className="text-slate-medium mt-1 line-clamp-2 wrap-break-word text-xs leading-4">
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
