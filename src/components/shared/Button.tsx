interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}
export function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-button shadow-button w-full rounded-md px-4 py-3 text-white transition-opacity ${
        disabled
          ? 'bg-slate-light text-slate-medium cursor-not-allowed'
          : 'bg-gradient cursor-pointer hover:opacity-90'
      } `}
    >
      {children}
    </button>
  )
}
