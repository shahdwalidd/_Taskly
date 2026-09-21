import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  isOptional?: boolean
  maxLength: number
  currentLength: number
  error?: string
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(
  (
    {
      label,
      isOptional,
      maxLength,
      currentLength,
      id,
      error,
      ...textareaProps
    },
    ref,
  ) => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-label-sm text-slate-medium uppercase"
          >
            {label}
          </label>
          {isOptional && (
            <span className="text-slate-medium/60 text-xs font-normal">
              Optional
            </span>
          )}
        </div>

        <textarea
          id={id}
          ref={ref}
          maxLength={maxLength}
          rows={6}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="bg-surface-highest text-slate-dark placeholder:text-slate-medium/50 focus:ring-brand/40 mt-2 w-full resize-none rounded-lg border border-transparent px-4 py-3 outline-none focus:ring-2"
          {...textareaProps}
        />

        {error ? (
          <p
            id={`${id}-error`}
            className="text-label-sm text-error mt-1 text-left"
          >
            {error}
          </p>
        ) : (
          <p className="text-label-sm text-slate-medium mt-1 text-right font-medium">
            {currentLength} / {maxLength} characters
          </p>
        )}
      </div>
    )
  },
)

TextAreaField.displayName = 'TextAreaField'
