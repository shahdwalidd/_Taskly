interface FooterLinkProps {
  text: string;
  linkText: string;
  onLinkClick?: () => void;
}

export function FooterLink({ text, linkText, onLinkClick }: FooterLinkProps) {
  return (
    <p className="text-center text-body-md text-slate-medium">
      {text}{" "}
      <button
        type="button"
        onClick={onLinkClick}
        className="text-primary font-semibold underline-offset-2 hover:underline"
      >
        {linkText}
      </button>
    </p>
  );
}