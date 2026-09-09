interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" ;
    disabled?: boolean;

}
export function Button({children,onClick,type="button",disabled=false}:ButtonProps){
    return(
        <button type={type} onClick={onClick} disabled={disabled}   className={`
        w-full py-3 px-4 rounded-md
        text-white text-[16px] font-semibold leading-6
        shadow-[0px_1px_2px_0px_#0000000D]
        transition-opacity
        ${disabled
          ? "bg-slate-light text-slate-medium cursor-not-allowed"
          : "bg-gradient hover:opacity-90 cursor-pointer"
        }
      `}>
            {children}
        </button>
    )
}