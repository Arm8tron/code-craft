"use client"
import CraftCard from '@/components/CraftCard'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { CodeCraft } from '@/types/CodeCraft'
import { User } from '@/types/User'
import React from 'react'

export default function Main({ userData, craftData }: { userData: User, craftData: CodeCraft[] }) {
    return (
        <div className='flex justify-center items-center p-5 flex-col gap-24'>
            <div className='w-1/2 bg-primary-foreground mt-10 rounded-xl flex flex-row items-center justify-start gap-10 px-5 py-10'>
                <Avatar className='w-15 border border-slate-700 h-15 p-2 rounded-full'>
                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?radius=50&size=36&seed=${userData.username}`}></AvatarImage>
                    <AvatarFallback>PFP</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-4'>
                    <span>{userData.email}</span>
                    <span>{userData.name}</span>
                </div>
            </div>
            <div className='flex flex-row flex-wrap gap-8 w-full justify-center items-center'>
                {
                    craftData.map((craft) => (
                        <CraftCard craft={craft} key={craft.craftId}/>
                    ))
                }
            </div>
        </div>
    )
}
