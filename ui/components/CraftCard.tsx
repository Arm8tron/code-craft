import { CodeCraft } from '@/types/CodeCraft'
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Preview from './Preview';
import {
    Heart,
    Eye
} from 'lucide-react';
import { useUser } from '@/app/providers';

type CraftCardProps = {
    craft: CodeCraft
}

export default function CraftCard({ craft : propsCraft }: CraftCardProps) {
    const { user } = useUser();
    const [craft, setCraft] = useState(propsCraft);
    const [isLiked, setLiked] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5023/api/view?craftId=${craft.craftId}`, {
            method: "PATCH"
        })
    }, []);

    useEffect(() => {
        if(!user) return;

        const likedBy = craft.likedBy.split(",");
        if(likedBy.includes(user.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [craft]);

    function toggleHeart() {
        const token = user.token;
        fetch(`http://localhost:5023/api/like?craftId=${craft.craftId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(res => res.json())
        .then((res) => {
            if(!res.error) {
                setCraft(res);
            }
        })
    }

    return (
        <Card className={"w-1/2 sm:w-1/3 overflow-hidden"}>
            <CardHeader className='py-4 pl-6'>
                <CardTitle>{craft.createdBy}</CardTitle>
                <CardDescription>{craft.name}</CardDescription>
            </CardHeader>
            <CardContent className='relative h-[40vh]'>
                <Preview
                    css={craft.css}
                    html={craft.html}
                    js={craft.js}
                />
            </CardContent>
            <CardFooter className='flex flex-row items-center justify-around pt-5'>
               <div onClick={toggleHeart} className=' hover:bg-slate-700 bg-slate-800 rounded-xl h-12 w-16 justify-center items-center cursor-pointer duration-300 flex flex-row gap-2'>
                    <span>{craft.likesCount}</span>
                    {
                        isLiked ? <Heart className='fill-primary stroke-primary'/> : <Heart/>   
                    }
               </div>
               <div className='bg-slate-800 rounded-xl h-12 w-16 justify-center items-center flex flex-row gap-2'>
                    <span>{craft.viewsCount}</span>
                    <Eye/>
               </div>
            </CardFooter>
        </Card>
    )
}
