import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Providers } from './providers'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'CodeCraft',
    description: 'The limit is your imagination!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
            <body className={`${inter.className} min-h-[100vh] flex flex-col`}>
                <Providers>
                    {children}
                </Providers>
                <Toaster />
            </body>
        </html>
    )
}
