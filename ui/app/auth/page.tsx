"use client"
import React, { useState, useEffect } from 'react';
import SignUpCard from '@/components/SignUpCard';
import SignInCard from '@/components/SignInCard';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

type authType = "signin" | "signup";

export default function Page() {
    const { user, loading, manualTriggerAuth } = useAuth();
    const [authType, setAuthType] = useState<authType>("signup");
    const router = useRouter();
    const searchParams = useSearchParams()

    useEffect(() => {
        if (user) {
            if (searchParams.has('redirect')) {
                const redirect = searchParams.get('redirect');
                router.push(`/craft/${redirect}`);
            } else {
                router.push(`/profile/${user.username}`);
            }
        }
    }, [user, loading]);

    function toggleAuthType() {
        if (authType == "signin") {
            setAuthType("signup");
        } else {
            setAuthType("signin");
        }
    }

    return (
        <main className='flex flex-1 items-center justify-center'>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 100
                }}
            >
                {
                    authType == "signin" ?
                        <SignInCard toggleAuthType={toggleAuthType} manualTriggerAuth={manualTriggerAuth} />
                        :
                        <SignUpCard toggleAuthType={toggleAuthType} />
                }
            </motion.div>

        </main>
    )
}

