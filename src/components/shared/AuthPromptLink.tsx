interface AuthPromptLinkProps {
  text: string
  linkText: string
  href: string
}

export function AuthPromptLink({ text, linkText, href }: AuthPromptLinkProps) {
  return (
    <p className="text-body-md text-slate-medium pt-footer-mobile mt-4 pb-8 text-center md:pt-8">
      {text}{' '}
      <a
        href={href}
        className="text-primary font-semibold underline-offset-2 hover:underline"
      >
        {linkText}
      </a>
    </p>
  )
}
