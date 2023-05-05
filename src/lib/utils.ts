import { twMerge } from 'tailwind-merge'
import { clsx, ClassValue } from 'clsx'

export const cn = (...input: ClassValue[]) => {
  return twMerge(clsx(input))
}
