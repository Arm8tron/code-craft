import React, { useEffect } from 'react'
import Main from './main'
import { User } from '@/types/User'
import { notFound } from 'next/navigation';

async function getUserData(username: string) {
    const userResponse = fetch(`http://localhost:5023/auth/user?username=${username}`, {
        method: "GET",
        cache: 'no-cache'
    }).then(res => res.json())
    
    
    const craftResponse = fetch(`http://localhost:5023/api/user?username=${username}`, {
        method: "GET",
        cache: 'no-cache'
    }).then(res => res.json())

    const [userData, craftData] = await Promise.all([userResponse, craftResponse])

    if(userData.error) {
        throw new Error(userData.error);
    }

    return [userData.response, craftData]

}

export default async function Page({ params }: { params: { username: string } }) {
    try {
        const [userData, craftData] = await getUserData(params.username);
        return (
            <Main userData={userData} craftData={craftData}/>
        )
    } catch (error) {
        notFound();
    }
}
