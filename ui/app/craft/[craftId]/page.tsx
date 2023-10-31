import { CodeCraft } from "@/types/CodeCraft";
import Main from "./main";
import { getData } from "@/lib/utils";
import { cookies } from 'next/headers'
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { craftId: string } }) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('session');
        const data : CodeCraft =  await getData(params.craftId, token);
        return (
            <Main fetchedCraftData={data}/>
        )
    } catch (error) {
       notFound();
    }
}
