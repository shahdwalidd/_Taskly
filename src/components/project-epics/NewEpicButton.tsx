import PlusIcon from '@/assets/fabicon.svg?react'

interface NewEpicButtonProps {
  onClick: () => void
}

export function NewEpicButton({ onClick }: NewEpicButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="bg-gradient shadow-invite-button text-button hidden h-12 shrink-0 cursor-pointer items-center gap-2 rounded-sm px-6 text-white md:inline-flex"
      >
       
       + New Epic
      </button>

      <button
        type="button"
        onClick={onClick}
        aria-label="New Epic"
        className="bg-primary-container shadow-invite-button fixed right-6 bottom-24 flex size-14 cursor-pointer items-center justify-center rounded-lg text-white md:hidden"
      >
        <PlusIcon aria-hidden="true" className="size-6" />
      </button>
    </>
  )
}