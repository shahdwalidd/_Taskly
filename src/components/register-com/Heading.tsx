export function Heading() {
  return (
    <div className="flex flex-col gap-2 text-left md:items-center md:text-center">
      <h1 className="text-slate-dark text-heading-sm md:text-pp">
        Create your workspace
      </h1>
      <p className="text-body-md leading-5.57 md:text-slate-medium text-grey hidden md:block md:leading-5">
        Join the editorial approach to task management.
      </p>
      <p className="text-body-md leading-5.57 md:text-slate-medium text-grey md:hidden md:leading-5">
        Join the curated environment for institutional trust and task
        precision.{' '}
      </p>
    </div>
  )
}
