"use client"
import CraftCard from '@/components/CraftCard';
import { CodeCraft } from '@/types/CodeCraft';
import React from 'react';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/app/providers';
import Header from './Header';

export default function Main({ crafts }: { crafts: CodeCraft[] }) {

    const { user, loading } = useUser();
    return (
        <>
            <Header/>
            <main className='flex flex-1 items-center justify-center flex-col gap-8 py-9'>
                {
                    crafts.map((craft, index) => (
                        <CraftCard craft={craft} key={index} />
                    ))
                }
            </main>
        </>
    )
}
