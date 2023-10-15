"use client"
import { CodeCraft } from '@/types/CodeCraft';
import { useRouter } from 'next/navigation'



export default function Page() {
    const router = useRouter();

    function goToRandomCraft() {
        fetch("http://localhost:5023/all")
        .then(res => res.json())
        .then((data : CodeCraft[]) => {
            const min = 0;
            const max = data.length;
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            router.push(`/crafts/${data[randomNum].craftId}`);
        })
    }

    return (
        <>
          <div> Bobblina</div>
          <button onClick={goToRandomCraft}>Go to random craft!</button>  
        </>
    )
}