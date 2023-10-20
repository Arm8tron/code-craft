import { CodeCraft } from "@/types/CodeCraft";
import Main from "./main";
import { getData } from "@/lib/utils";
import { DEFAULT_CSS, DEFAULT_HTML, DEFAULT_JS } from "@/lib/constants";

export default async function Page({ params }: { params: { craftId: string } }) {
    let data : CodeCraft;

    try {
        data =  await getData(params.craftId)
    } catch (error) {
        data = {
            craftId: params.craftId,
            createdBy: "",
            html: DEFAULT_HTML,
            css: DEFAULT_CSS,
            js: DEFAULT_JS,
            name: "New Craft"
        }
    }

    return (
        <Main craftData={data}/>
    )
}
