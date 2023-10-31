"use client"


import { useUser } from '@/app/providers'
import React, { useState } from 'react'
import {
    Avatar, AvatarFallback, AvatarImage
} from '@/components/ui/avatar'
import { Button } from './ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { useRouter } from 'next/navigation';
import { DEFAULT_CSS, DEFAULT_HTML, DEFAULT_JS } from '@/lib/constants';
import { CodeCraft } from '@/types/CodeCraft';
import randomstring from 'randomstring';

export default function Header() {
    const router = useRouter();
    const { user } = useUser();
    const [craftName, setCraftName] = useState("");

    function createNewPen(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!user) {
            toast({
                variant: "destructive",
                description: "Please Sign In",
                action: <ToastAction altText='Sign In' onClick={() => { router.push("/auth") }}>Sign In</ToastAction>
            })
            return;
        }

        const craftId = randomstring.generate({
            length: 5,
            charset: 'alphanumeric'
        })

        const newCraftData : CodeCraft = {
            html : DEFAULT_HTML,
            css : DEFAULT_CSS,
            js : DEFAULT_JS,
            name: craftName,
            createdBy: user.username,
            craftId: craftId,
            isPublic: true,
            isFork: true,
            viewsCount: 0,
            likesCount: 0,
            likedBy: ""
        }

        fetch("http://localhost:5023/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCraftData)
        }).then(res => res.json())
            .then(() => {
                router.push(`/craft/${craftId}`)
            })
    }

    return (
        <header className='border-b border-slate-500 flex flex-row justify-between px-4 py-2 items-center gap-2'>
            {user && <span>Hello {user?.name}</span>}
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Create new Pen</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Give a name to your new craft</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={createNewPen} className='flex flex-col justify-center items-center gap-2'>
                        <Input 
                            placeholder='Craft Name' 
                            name='craft-name'
                            value={craftName}
                            onChange={e => setCraftName(e.target.value)}
                        />
                        <Button type='submit'>Create new Pen</Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Avatar className='w-10 border border-slate-700 h-10 p-2 hover:bg-slate-600 duration-200 rounded-full cursor-pointer'>
                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?radius=50&size=36&seed=${user?.username}`}></AvatarImage>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </header>
    )
}
