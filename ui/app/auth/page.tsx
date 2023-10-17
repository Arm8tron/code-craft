"use client"
import React, { useState, useEffect } from 'react';
import SignUpCard from '@/components/SignUpCard';
import SignInCard from '@/components/SignInCard';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

type authType = "signin" | "signup";

export default function Page() {
    const { user, loading, manualTriggerAuth } = useAuth();
    const [authType, setAuthType] = useState<authType>("signup");
    const router = useRouter();

    useEffect(() => {
        if(user) {
            router.push(`/profile/${user.username}`);
        }
    }, [user, loading]);

    function toggleAuthType() {
        if(authType == "signin") {
            setAuthType("signup");
        } else {
            setAuthType("signin");
        }
    }

    return (
        <main className='flex flex-1 items-center justify-center'>
            {
                authType == "signin" ? <SignInCard toggleAuthType={toggleAuthType} manualTriggerAuth={manualTriggerAuth}/> : <SignUpCard toggleAuthType={toggleAuthType}/>
            }
        </main>
    )
}

