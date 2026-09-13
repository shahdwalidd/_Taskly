import { Logo } from './LogoIcon'

export function Header() {
  return (
    <header className="md:bg-background flex h-20 w-full items-center bg-white px-6 md:px-10">
      <Logo />
    </header>
  )
}
