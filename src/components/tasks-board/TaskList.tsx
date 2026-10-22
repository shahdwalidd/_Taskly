import type { Task } from '@/types/addTask.types'
import { toTaskCardProps } from '@/utils/taskBoard'
import { TaskCard } from './TaskCard'

interface TaskListProps {
	tasks: Task[]
	onTaskClick?: (taskId: string) => void
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
	return (
		<ul aria-label="Tasks" className="flex flex-col gap-3.5">
			{tasks.map((task) => (
				<li key={task.id}>
					<TaskCard {...toTaskCardProps(task)} onClick={onTaskClick ? () => onTaskClick(task.id) : undefined} />
				</li>
			))}
		</ul>
	)
}
