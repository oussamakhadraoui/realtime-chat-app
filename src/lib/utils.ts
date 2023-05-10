import { twMerge } from 'tailwind-merge'
import { clsx, ClassValue } from 'clsx'

export const cn = (...input: ClassValue[]) => {
  return twMerge(clsx(input))
}
export const chatLinkGen = (id1: string, id2: string) => {
  const list = [id1, id2].sort()
  return `${list[0]}--${list[1]}`
}
export const pusherTransKey = (key: string) => {
  const data = key.replace(/:/g, '__')
  return data
}
