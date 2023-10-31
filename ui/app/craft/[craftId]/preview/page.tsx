import { getData } from '@/lib/utils';
import Preview from '@/components/Preview';
import { CodeCraft } from '@/types/CodeCraft';
import { cookies } from 'next/headers'

export default async function Page({ params } : { params : { craftId : string } }) {
    let craftData : CodeCraft | null = null;

    try {
        const cookieStore = cookies();
        const token = cookieStore.get('session');
        craftData =  await getData(params.craftId, token);
    } catch (error) {
        console.log(error);
    }

    return (
        <div className='flex-1 flex'>
            {
                craftData == null ? 
                    <div className='flex items-center justify-center'>Craft not found</div> :  
                    <Preview html={craftData.html} css={craftData.css} js={craftData.js}/>
            }
        </div>
    )
}
