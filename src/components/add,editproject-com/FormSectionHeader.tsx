import HeaderIcon from "../../assets/AddprojIcon.svg?react"
interface FormSectionHeaderProps{
title: string;
  description: string;

}
export function FormSectionHeader({title, description}:FormSectionHeaderProps){
    return(
<div className="flex flex-center gap-4 pb-8 md:p-8 md:pb-10 md:border-b-surface-low">
    <div className="hidden md:flex h-11 w-11 shrink-0 items-center justify-center">
<HeaderIcon/>
    </div>
    <div>
            <h2 className="text-2xl font-semibold text-slate-dark">{title}</h2>
        <p className="mt-1 text-sm text-slate-medium">{description}</p>
    </div>
</div>
    )
}