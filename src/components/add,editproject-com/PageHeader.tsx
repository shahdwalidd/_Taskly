interface PageHeaderProps{
    title:string,
}
export function PageHeader({title}:PageHeaderProps){
return(
<h1 className="hidden md:flex text-headline-lg text-slate-dark mt-2 ">{title}</h1>



)

}