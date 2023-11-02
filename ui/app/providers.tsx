'use client'
import { User } from '@/types/User';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import Cookies from 'universal-cookie';
import { customFetch } from '@/lib/utils';

const UserContext = createContext<any>(null);

export function Providers({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!user) {
            login();
        }
    }, []);

    function login() {
        customFetch({ pathName: 'auth/fetch' })
            .then((data) => {
                setUser(data.response);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }

    function logout() {
        setUser(null);
        customFetch({ pathName: `auth/logout` })
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </UserContext.Provider>
    )

}


export function useUser() {
    return useContext(UserContext);
}