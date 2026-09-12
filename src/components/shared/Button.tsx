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
      className={`w-full rounded-md px-4 py-3 text-[16px] leading-6 font-semibold text-white shadow-[0px_1px_2px_0px_#0000000D] transition-opacity ${
        disabled
          ? 'bg-slate-light text-slate-medium cursor-not-allowed'
          : 'bg-gradient cursor-pointer hover:opacity-90'
      } `}
    >
      {children}
    </button>
  )
}
