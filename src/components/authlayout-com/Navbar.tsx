import MenuIcon from "../../assets/icons/Menuicon.svg?react"
import { getInitials } from "../../utils/getInitials";
import { useUser } from "../../hooks/useUser";
interface NavbarProps{

onMenuClick?:()=>void;
}
export function Navbar({onMenuClick}:NavbarProps){
  const { user, isLoading } = useUser()

  const userName = user?.user_metadata.name ?? ''
  const jobTitle = user?.user_metadata.department ?? ''
  const initials = getInitials(userName)
return(
<header className="flex items-center px-6 py-3 md:px-8 justify-between bg-background border-b border-border-subtle">
<div className="flex  items-center gap-4 md:hidden">
    <button onClick={onMenuClick}  aria-label="Open menu" className="flex items-center"
>
    <MenuIcon className="h-3 w-icon-menu-width"/>
</button>
<span className="text-slate-dark text-logo">TASKLY</span>
</div>
<div className="ml-auto gap-4 flex items-center">
<div className="hidden flex-col items-end sm:flex">
<span className="text-body-sm font-bold text-slate-dark">            {isLoading ? '...' : userName}
</span>
<span className="text-label-xs uppercase text-right text-primary">{isLoading ? '...':jobTitle}</span>
</div>
<div className="w-10 h-10 rounded-md flex justify-center items-center text-button text-background shadow-avatar bg-primary-container ">{initials}</div>
</div>
</header>











)





}