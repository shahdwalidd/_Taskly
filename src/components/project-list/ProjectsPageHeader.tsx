interface ProjectPgeHeaderprops {
  title: string
  subtitle: string
  onCreateClick: () => void
}
export function ProjectPgeHeader({
  title,
  subtitle,
  onCreateClick,
}: ProjectPgeHeaderprops) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-pp text-slate-dark">{title}</h1>
        <p className="text-button text-grey font-normal">{subtitle}</p>
      </div>
      <button
        className="bg-gradient text-button hidden rounded-xs px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 md:block"
        onClick={onCreateClick}
      >
        Create New Project
      </button>
    </div>
  )
}
