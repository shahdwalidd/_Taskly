export function Heading() {
  return (
    <div className="flex flex-col gap-2 text-left md:items-center md:text-center">
      <h1 className="text-[28px] md:text-[30px] font-semibold leading-10 md:leading-9 tracking-[-0.8px] md:tracking-[-0.75px] text-slate-dark">
        Create your workspace
      </h1>
      <p className=" hidden md:block text-body-md leading-5.57 md:leading-5 text-[#434654] md:text-slate-medium">
       Join the editorial approach to task management.
      </p>
 <p className=" md:hidden text-body-md leading-5.57 md:leading-5 text-[#434654] md:text-slate-medium">
Join the curated environment for institutional trust
and task precision.      </p>
    </div>
  );
}