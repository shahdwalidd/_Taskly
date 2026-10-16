import type { TaskStatusValue } from '@/types/addTask.types'
import { cn } from '@/utils/cn'
import { taskStatuses } from './TaskStatus'

interface TaskCardStatusPillProps {
	statusId: TaskStatusValue
}

export function TaskCardStatusPill({ statusId }: TaskCardStatusPillProps) {
	const status = taskStatuses.find((item) => item.id === statusId)
	if (!status) return null

	return (
		<span
			className={cn(
				'inline-flex h-5.25 items-center rounded-xs px-2.5 text-[10px] font-bold tracking-wider uppercase md:hidden',
				status.pillClass,
			)}
		>
			{status.label}
		</span>
	)
}
