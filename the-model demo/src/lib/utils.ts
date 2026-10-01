import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Stand-in for uni-demo's `@/lib/utils`. Byte-for-byte the shadcn default, so
 * the real one can replace this file with no other change.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
