interface FormFieldProps {
    label: string;
    name: string;
    type?: "text" | "email" | "password";
    placeholder?: string;
    hint?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function FormField({
    label,
    name,
    type = "text",
    placeholder,
    hint,
    value,
    onChange,
    error
}: FormFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-label-sm uppercase text-slate-medium">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full py-3.5 px-4 rounded-sm text-body-md bg-surface-highest placeholder:text-slate-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error?(<span className="text-label-sm text-error">{error}</span>):hint?(<span className="text-[11px] font-normal leading-[16.5px] tracking-[0px] text-slate-medium">{hint}</span>):null}
        </div>
    )
}