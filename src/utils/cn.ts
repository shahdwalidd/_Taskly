import { twMerge } from 'tailwind-merge'

type ClassInput = string | false | null | undefined

export function cn(...classes: ClassInput[]) {
  return twMerge(classes.filter(Boolean).join(' '))
}