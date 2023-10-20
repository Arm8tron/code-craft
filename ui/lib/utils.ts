import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getData = (async (craftId: string) => {
    const res = await fetch(`http://localhost:5023/api?craftId=${craftId}`);

    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res.json();
})