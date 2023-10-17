"use client"
import React, { useState } from 'react';
import SignUpCard from '@/components/SignUpCard';
import SignInCard from '@/components/SignInCard';

type authType = "signin" | "signup";

export default function Page() {
    const [authType, setAuthType] = useState<authType>("signup");

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
                authType == "signin" ? <SignInCard toggleAuthType={toggleAuthType}/> : <SignUpCard toggleAuthType={toggleAuthType}/>
            }
        </main>
    )
}

