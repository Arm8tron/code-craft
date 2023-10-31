import { type ClassValue, clsx } from "clsx"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getData = (async (craftId: string, token: RequestCookie | undefined) => {
    const res = await fetch(`http://localhost:5023/api?craftId=${craftId}`, {
        headers: {
            Authorization: `Bearer ${token?.value}`,
        },
        method: "GET",
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res.json();
})

export const sleep = async (ms : number) => {
    return new Promise<void>((resolve, _) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}