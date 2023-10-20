"use client"

import { useEffect, useState } from 'react'
import { getData } from '@/lib/utils';
import Preview from '@/components/Preview';
import { CodeCraft } from '@/types/CodeCraft';

export default function Page({ params } : { params : { craftId : string } }) {
    const [craftData, setCraftData] = useState<CodeCraft>();

    useEffect(() => {
        getData(params.craftId).then(data => {
            setCraftData(data);
        })
    }, []);

    return (
        <div className='flex-1 flex'>
            {
                craftData == null ? 
                    <div className='flex items-center justify-center'>Loading...</div> :  
                    <Preview html={craftData.html} css={craftData.css} js={craftData.js}/>
            }
        </div>
    )
}
