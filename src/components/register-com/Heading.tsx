export function Heading() {
  return (
    <div className="flex flex-col gap-2 text-left md:items-center md:text-center">
      <h1 className="text-slate-dark text-[28px] leading-10 font-semibold tracking-[-0.8px] md:text-[30px] md:leading-9 md:tracking-[-0.75px]">
        Create your workspace
      </h1>
      <p className="text-body-md leading-5.57 md:text-slate-medium hidden text-[#434654] md:block md:leading-5">
        Join the editorial approach to task management.
      </p>
      <p className="text-body-md leading-5.57 md:text-slate-medium text-[#434654] md:hidden md:leading-5">
        Join the curated environment for institutional trust and task
        precision.{' '}
      </p>
    </div>
  )
}
