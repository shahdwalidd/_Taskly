import FastIcon from '@/assets/fast.svg?react'
import Emptyimage from '@/assets/empty.svg?react'
interface EmptyEpicsStateProps {
  onCreateClick: () => void
}

export function EmptyEpicsState({ onCreateClick }: EmptyEpicsStateProps) {
  return (
    <div className="flex flex-col items-center py-20">
      <Emptyimage className="mt-30 h-72 w-72" />
      <div className="flex flex-col items-center text-center">
        <h2 className="text-headline-lg text-slate-dark">No epics in this project yet.</h2>
        <p className="text-title-md text-grey mt-2 max-w-md font-normal">
         Break down your large project into manageable
epics to track progress better and maintain
architectural clarity.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="bg-gradient mt-10 w-auto rounded-sm px-8 py-4 text-white transition-opacity hover:opacity-90"
      >
        <FastIcon aria-hidden="true" className="mr-2 inline size-4" />
      Create First Epic
      </button>
    </div>
  )
}
