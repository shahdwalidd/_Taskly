import PlusIcon from "../../assets/PlusIcon.svg?react"
interface AddProjectCardProps{
onClick:()=>void
}
export function AddProjectCard ({onClick}:AddProjectCardProps){
    return(
<button onClick={onClick} className="hidden flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-light/20 p-6 md:flex">
<span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-low"> <PlusIcon className="w-5 h-5"/></span>
<span className="text-boy-sm tracking-custom uppercase text-grey ">ADD PROJECT</span>



</button>



    )
}