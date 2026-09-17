import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  isOptional?: boolean;
  maxLength: number;
  currentLength: number;
  error?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, isOptional, maxLength, currentLength, id, error, ...textareaProps }, ref) => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-label-sm  uppercase  text-slate-medium">
            {label}
          </label>
          {isOptional && <span className="text-xs  font-normal text-slate-medium/60 ">Optional</span>}
        </div>

        <textarea
          id={id}
          ref={ref}
          maxLength={maxLength}
          rows={6}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-2 w-full resize-none rounded-lg border border-transparent bg-surface-highest px-4 py-3 text-slate-dark outline-none placeholder:text-slate-medium/50 focus:ring-2 focus:ring-brand/40"
          {...textareaProps}
        />

        {error ? (
          <p id={`${id}-error`} className="mt-1 text-left text-label-sm text-error">
            {error}
          </p>
        ) : (
          <p className="mt-1 text-right text-label-sm text-slate-medium font-medium">
            {currentLength} / {maxLength} characters
          </p>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";