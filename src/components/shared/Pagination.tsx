import { useState } from "react";
import ChevronRightIcon from "../../assets/ChevronRightIcon.svg?react";
import  ChevronLeftIcon from "../../assets/ChevronLeftIcon.svg?react";
interface PaginationProps{
    totalPages:number;
}
export function Pagination({totalPages}:PaginationProps){
    const [currentPage, setCurrentPage] = useState(1);
    const visiblePages = [1, 2, 3];
return(
    <nav className="hidden items-center gap-2 md:flex" aria-label="Pagination">
<button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
 className= "flex  h-8 w-8 border border-slate-light/30 rounded-xs items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeftIcon className="w-4 h-4"/></button>

{visiblePages.map((page)=>(
    <button key={page}
          onClick={() => setCurrentPage(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`flex  h-8 w-8 border border-slate-light/30 rounded-xs items-center justify-center   ${currentPage === page
              ? "bg-primary text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>{page}</button>
))}

<span className="flex  h-8 w-8 border border-slate-light/30 rounded-xs items-center justify-center" > ...</span>

<button  onClick={() => setCurrentPage(totalPages)}
        aria-current={currentPage === totalPages ? "page" : undefined}
                 className={`flex  h-8 w-8 border border-slate-light/30 rounded-xs items-center justify-center   ${currentPage === totalPages
              ? "bg-primary text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>        {totalPages}
           
</button>
<button  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
         className= "flex  h-8 w-8 border border-slate-light/30 rounded-xs items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRightIcon className="w-4 h-4"/></button>



</nav>








)















}