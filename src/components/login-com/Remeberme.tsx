import type { ChangeEvent } from "react";

export interface RememberMeSectionProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onForgotPassword: () => void;
  disabled?: boolean;
  className?: string;
}

export function RememberMeSection({
  checked,
  onCheckedChange,
  onForgotPassword,
  disabled = false,
  className = "",
}: RememberMeSectionProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange(event.target.checked);
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
     
      <label className="flex items-center gap-2 cursor-pointer select-none">
       
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />

        <span
          className={`w-5 h-5 md:w-4 md:h-4 rounded-xs border flex items-center justify-center shrink-0 transition-colors ${
            checked
              ? "bg-primary border-primary"
              : "bg-white md:bg-surface-low border-slate-light"
          } ${disabled ? "opacity-50" : ""}`}
        >
          {checked && (
            <span className="material-symbols-outlined text-white text-[12px] leading-none">
              check
            </span>
          )}
        </span>

        <span className=" text-body-md text-[#434654]">
          Remember Me
        </span>
      </label>

      <button
        type="button"
        onClick={onForgotPassword}
        disabled={disabled}
        className="hidden md:inline text-[14px] font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs disabled:opacity-50 disabled:pointer-events-none"
      >
        Forgot Password?
      </button>
    </div>
  );
}