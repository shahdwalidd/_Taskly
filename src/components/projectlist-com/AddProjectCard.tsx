import PlusIcon from '../../assets/PlusIcon.svg?react'
interface AddProjectCardProps {
  onClick: () => void
}
export function AddProjectCard({ onClick }: AddProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="border-slate-light/20 hidden flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 md:flex"
    >
      <span className="bg-surface-low flex h-12 w-12 items-center justify-center rounded-full">
        {' '}
        <PlusIcon className="h-5 w-5" />
      </span>
      <span className="text-boy-sm tracking-custom text-grey uppercase">
        ADD PROJECT
      </span>
    </button>
  )
}
