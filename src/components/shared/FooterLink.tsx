interface FooterLinkProps {
  text: string
  linkText: string
  onLinkClick?: () => void
}

export function FooterLink({ text, linkText, onLinkClick }: FooterLinkProps) {
  return (
    <p className="text-body-md text-slate-medium pt-footer-mobile mt-4 pb-8 text-center md:pt-8">
      {text}{' '}
      <button
        type="button"
        onClick={onLinkClick}
        className="text-primary font-semibold underline-offset-2 hover:underline"
      >
        {linkText}
      </button>
    </p>
  )
}
