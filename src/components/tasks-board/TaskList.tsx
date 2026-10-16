import type { Task } from '@/types/addTask.types'
import { toTaskCardProps } from '@/utils/taskBoard'
import { TaskCard } from './TaskCard'

interface TaskListProps {
	tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
	return (
		<ul aria-label="Tasks" className="flex flex-col gap-3.5">
			{tasks.map((task) => (
				<li key={task.id}>
					<TaskCard {...toTaskCardProps(task)} />
				</li>
			))}
		</ul>
	)
}
