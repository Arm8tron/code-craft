"use client"
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation'



export default function Page() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if(user) {
            router.push(`/profile/${user.username}`)
        } else {
            if(!loading) {
                router.push(`/auth`);
            }
        }
    }, [user, loading]);

    return (
        <main className='flex flex-1 items-center justify-center'>
          <h1>Welcome to Codecraft!</h1>
        </main>
    )
}