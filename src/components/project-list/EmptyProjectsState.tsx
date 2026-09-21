import Emptyimage from '@/assets/Emptystate.svg'
interface EmptyProjectsStateProps {
  onCreateClick: () => void
}

export function EmptyProjectsState({ onCreateClick }: EmptyProjectsStateProps) {
  return (
    <div className="flex flex-col items-center py-20">
      <img src={Emptyimage} className="mt-30 h-72 w-72" />
      <div className="flex flex-col items-center text-center">
        <h2 className="text-headline-lg text-slate-dark">No Projects</h2>
        <p className="text-title-md text-grey mt-2 max-w-md font-normal">
          You don't have any projects yet. Start by defining your first
          architectural workspace to begin tracking tasks and epics.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="bg-gradient mt-10 w-auto rounded-sm px-8 py-4 text-white transition-opacity hover:opacity-90"
      >
        Create New Project
      </button>
    </div>
  )
}
