import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Shared className helper used by shadcn/ui components and app UI. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
