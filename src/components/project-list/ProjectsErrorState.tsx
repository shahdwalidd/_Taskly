import ErrorIcon from '@/assets/ErroIcon.svg?react'
interface ProjectsErrorStateProps {
  onRetry: () => void
}

export function ProjectsErrorState({ onRetry }: ProjectsErrorStateProps) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <span className="bg-babyred mt-30 flex h-16 w-16 items-center justify-center rounded-lg">
        {' '}
        <ErrorIcon className="h-8 w-8" />
      </span>
      <div>
        {' '}
        <h2 className="text-logo text-slate-dark font-semibold">
          Something went wrong
        </h2>
        <p className="text-button text-grey mt-2 max-w-md font-normal">
          We're having trouble retrieving your projects right now. Please try
          again in a moment.
        </p>{' '}
      </div>
      <button
        onClick={onRetry}
        className="bg-primary mt-10 w-auto rounded-sm px-8 py-4 text-white transition-opacity hover:opacity-90"
      >
        Retry Connection
      </button>
    </div>
  )
}
