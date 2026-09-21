interface PageHeaderProps {
  title: string
}
export function PageHeader({ title }: PageHeaderProps) {
  return (
    <h1 className="text-headline-lg text-slate-dark mt-2 hidden md:flex">
      {title}
    </h1>
  )
}
