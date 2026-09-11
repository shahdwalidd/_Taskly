import { useState } from "react";
interface PasswordFieldProps {
    label: string;
    name: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    
  linkText?: string;
  onLinkClick?: () => void;
}
export function PasswordField({
    label,
    name,
    placeholder,
    value,
    onChange,
    error, linkText,
  onLinkClick,}:PasswordFieldProps){
        const [showPassword, setShowPassword] = useState(false);
        return(
            <div className="flex flex-col gap-1.5" >
                  <div className="flex items-center justify-between">
<label htmlFor={name} className="text-label-sm uppercase text-slate-medium">
{label}
</label>

        {linkText && (
          <button
            type="button"
            onClick={onLinkClick}
            className="text-label-sm md:hidden text-primary hover:underline"
          >
            {linkText}
          </button>
        )}
        </div>
<div className="relative">
<input id={name}
name={name}
type={showPassword?"text":"password"}
value={value}
placeholder={placeholder}
onChange={ (e) =>onChange(e.target.value)} className="w-full px-4 py-3.5 radius-sm pr-12 text-body-md bg-surface-highest placeholder:text-slate-medium focus:outline-none focus:ring-2 focus:ring-primary"

/>
<button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-medium">
    <span className="material-symbols-outlined">{showPassword?"visibility_off" : "visibility"}</span></button>
</div>
{error&&(<span className="text-label-sm text-error">{error}</span>)}
            </div>
        )
    }