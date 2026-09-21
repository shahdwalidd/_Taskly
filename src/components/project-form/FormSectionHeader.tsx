import HeaderIcon from '@/assets/AddprojIcon.svg?react'
interface FormSectionHeaderProps {
  title: string
  description: string
}
export function FormSectionHeader({
  title,
  description,
}: FormSectionHeaderProps) {
  return (
    <div className="flex-center md:border-b-surface-low flex gap-4 pb-8 md:p-8 md:pb-10">
      <div className="hidden h-11 w-11 shrink-0 items-center justify-center md:flex">
        <HeaderIcon />
      </div>
      <div>
        <h2 className="text-slate-dark text-2xl font-semibold">{title}</h2>
        <p className="text-slate-medium mt-1 text-sm">{description}</p>
      </div>
    </div>
  )
}
