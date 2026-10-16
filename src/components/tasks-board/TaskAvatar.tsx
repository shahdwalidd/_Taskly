import { getInitials } from '@/utils/getInitials'
import { cn } from '@/utils/cn'

interface TaskAvatarProps {
	name: string
	highlighted?: boolean
}

export function TaskAvatar({ name, highlighted = false }: TaskAvatarProps) {
	return (
		<span
			title={name}
			className={cn(
				'flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold',
				highlighted
					? 'bg-primary-container text-white'
					: 'bg-surface-highest text-slate-dark',
			)}
		>
			{getInitials(name)}
		</span>
	)
}
