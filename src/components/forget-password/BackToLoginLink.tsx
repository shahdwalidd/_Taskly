import { Link } from 'react-router-dom'
import ArrowLeftIcon from '@/assets/Arrowlogin.svg?react'

export function BackToLoginLink() {
  return (
    <Link
      to="/login"
      className="text-boy-sm text-primary flex items-center justify-center gap-2 font-medium hover:opacity-80"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back to log in
    </Link>
  )
}
