import { CodeCraft } from '@/types/CodeCraft';
import Main from '../components/HomePage';

async function getCrafts() {
    return await fetch('http://localhost:5023/all', {
        cache: "no-cache"
    })
        .then(res => res.json())
}

export default async function Page() {
    const crafts: CodeCraft[] = await getCrafts();


    return <Main crafts={crafts}/>
}