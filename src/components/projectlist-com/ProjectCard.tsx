import Epicsicon from "../../assets/Epicsprimary.svg?react"
import Tasksicon from "../../assets/Tasksprimary.svg?react"
import Membersicon from "../../assets/Membersprimary.svg?react"
interface ProjectCardProps{
name:string,
description: string,
createdAt: string,
onClick:()=>void

}
export function ProjectCard({name,description,createdAt,onClick}:ProjectCardProps){
return(

<button className="p-6 rounded-md flex flex-col text-left shadow-sm" onClick={onClick}>
<h2>{name}</h2>
<p>{description}</p>

<div className="flex items-center justify-between pt-4 ">
    <span className="gap-1 flex text-label-xs text-primary">
        <Epicsicon className="w-4 h-4"/>Epics
</span>
    <span className="gap-1 flex text-label-xs text-primary"><Tasksicon className="w-4 h-4"/>
              Tasks</span>
    <span className="gap-1 flex text-label-xs text-primary"> <Membersicon className="w-4 h-4"/>Members</span>
</div>
<div className="flex justify-between mt-4 items-center border-t border-slate-light/10">
    <span className="text-label-sm text-overlay-gray uppercase">Created At
</span>
<span className="text-boy-sm text-grey">{createdAt}</span>
</div>












</button>





)







}