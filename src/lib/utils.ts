import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add any other utility functions from the root lib/utils.ts here
// For example, if there were any additional functions in the root lib/utils.ts, 
// you would add them below this line.