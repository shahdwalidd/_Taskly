interface EpicIdProps {
  code: string
}

export function EpicId({ code }: EpicIdProps) {
  return (
    <span className="bg-surface-highest text-label-xs text-primary inline-flex w-fit items-center rounded-xs px-2.5 py-px uppercase">
      {code}
    </span>
  )
}