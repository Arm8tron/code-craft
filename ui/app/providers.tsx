'use client'
import { User } from '@/types/User';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import Cookies from 'universal-cookie';

const UserContext = createContext<any>(null);

export function Providers({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if(!user) {
            login();
        }
    }, []);

    function login() {
        const cookies = new Cookies();
        const token = cookies.get('session');

        if (token) {
            // If token is present, send a request to the server to get user data
            fetch('http://localhost:5023/auth/fetch', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    setUser({
                        ...data.response,
                        token: token
                    });
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }

    function logout() {
        setUser(null);
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