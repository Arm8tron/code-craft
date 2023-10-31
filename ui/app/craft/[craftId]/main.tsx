"use client"

import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { CodeCraft } from '@/types/CodeCraft';
import Preview from '@/components/Preview';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    User,
    LogIn,
    Pencil
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useUser } from '@/app/providers';


const formSchema = zod.object({
    craftId: zod.string().min(1),
    craftName: zod.string().min(4),
});

export default function Main({ fetchedCraftData }: { fetchedCraftData: CodeCraft }) {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<zod.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            craftId: "",
            craftName: ""
        }
    })

    const craftNameRef = useRef<HTMLInputElement>(null);
    const htmlPanelRef = useRef<HTMLDivElement>(null);
    const cssPanelRef = useRef<HTMLDivElement>(null);
    const jsPanelRef = useRef<HTMLDivElement>(null);
    const codeEditorRef = useRef<HTMLDivElement>(null);

    const [craftData, setCraftData] = useState<CodeCraft>(fetchedCraftData);
    const [js, setJs] = useState<string>(fetchedCraftData.js);
    const [html, setHtml] = useState<string>(fetchedCraftData.html);
    const [css, setCss] = useState<string>(fetchedCraftData.css);
    const [isPublic, setPublic] = useState<boolean>(fetchedCraftData.isPublic);
    const [panelWidths, setPanelWidths] = useState<number[]>([0.33, 0.33, 0.33]);
    const [codeEditorHeight, setCodeEditorHeight] = useState<number>(0.5);

    useEffect(() => {
        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [css, js, html]);

    useEffect(() => {
        if(isPublic != craftData.isPublic) {
            saveCraft();
        }
    }, [isPublic]);

    function handleUnload(e: BeforeUnloadEvent) {
        const shouldShowAlert = !(js === craftData.js && html === craftData.html && css === craftData.css);
       
        if (shouldShowAlert) {
            const confirmationMessage = 'Are you sure you want to leave? Your changes may not be saved.';
            (e || window.event).returnValue = confirmationMessage; // Standard for most browsers
            return confirmationMessage; // For some older browsers
        }
    }

    function handleKeyDown(ev : KeyboardEvent) {
        if(ev.ctrlKey && ev.key === 's') {
            ev.preventDefault();
            saveCraft();
        }
    }

    function saveCraft() {
        if (user == null) {
            toast({
                variant: "destructive",
                description: "Please Sign In",
                action: <ToastAction altText='Sign In' onClick={() => { router.push("/auth") }}>Sign In</ToastAction>
            })
            return;
        }

        const newCraftData : CodeCraft = { 
            ...craftData,
            js,
            html,
            css,
            createdBy: craftData.createdBy || user.username,
            isPublic: isPublic
        }

        fetch("http://localhost:5023/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCraftData)
        }).then(res => res.json())
            .then(() => {
                setCraftData(newCraftData);
                document.title = craftData.name;
            })
    }

    function updateJs(e: string) {
        setJs(e);
    }

    function updateHtml(e: string) {
        setHtml(e);
    }

    function updateCss(e: string) {
        setCss(e);
    }

    function handleResizePanels(index: number, initialX: number) {
        const screenWidth = window.innerWidth;

        document.onmousemove = (e) => {
            const deltaX = ((e.clientX - initialX) / screenWidth);
            const newWidths = [...panelWidths];
            newWidths[index] += deltaX;
            newWidths[index + 1] -= deltaX;
            setPanelWidths(newWidths);
        }

        document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    function forkCraft(values: zod.infer<typeof formSchema>) {
        if (!user) {
            toast({
                variant: "destructive",
                description: "Please Sign In",
                action: <ToastAction altText='Sign In' onClick={() => { router.push("/auth") }}>Sign In</ToastAction>
            })
            return;
        }

        const newCraftData : CodeCraft = {
            html,
            css,
            js,
            name: values.craftName,
            createdBy: user.username,
            craftId: values.craftId,
            isPublic: isPublic,
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
                router.push(`/craft/${values.craftId}`)
            })
    }

    function toggleCraftName() {
        if (!craftNameRef.current) return;

        if (craftNameRef.current.disabled) {
            craftNameRef.current.disabled = false;
            craftNameRef.current.focus();
        } else {
            craftNameRef.current.disabled = true;
            craftData.name = craftNameRef.current.value;  
            saveCraft();          
        }

    }

    function togglePublic(value : boolean) {
        setPublic(value);
    }

    return (
        <>
            <header className="border-b border-slate-500 flex flex-row justify-between px-4 py-2">
                <div className="flex flex-col space-y-2">
                    <div className='flex flex-row items-center'>
                        <input
                            ref={craftNameRef}
                            style={{ width: `${craftData.name.length * 10}px` }}
                            defaultValue={craftData?.name}
                            className='bg-background focus:outline-none font-semibold text-lg'
                            disabled
                            onBlur={toggleCraftName}
                            onClick={toggleCraftName}
                        />
                        <Pencil style={{ display: craftData?.createdBy == user?.username || craftData?.createdBy == "" ? "block" : "none" }} className='w-4 ml-2 cursor-pointer' onClick={toggleCraftName} />
                    </div>
                    <span className='text-slate-500 text-sm'>By {craftData.createdBy}</span>
                </div>
                <div className='flex flex-row items-center gap-3'>
                    <div className='flex flex-row items-center gap-2'>
                        <span className='text-xs'>Private</span>
                        <Switch checked={isPublic} onCheckedChange={togglePublic}/>
                        <span className='text-xs'>Public</span>
                    </div>
                    <Button style={{ display: craftData?.createdBy == user?.username || craftData?.createdBy == "" ? "block" : "none" }} onClick={saveCraft}>
                        Save
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Fork</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Give a name and id to your new craft</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(forkCraft)} className="space-y-3 w-full">
                                    <FormField
                                        control={form.control}
                                        name="craftName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Craft Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Craft Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="craftId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Craft ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Craft ID" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className='w-full'>Create new fork</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                    <Button>
                        <Link href={`/craft/${craftData.craftId}/preview`}>
                            Preview
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className='w-10 border border-slate-700 h-10 p-2 hover:bg-slate-600 duration-200 rounded-full cursor-pointer'>
                                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?radius=50&size=36&seed=${user?.username}`}></AvatarImage>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {
                                user ?
                                    <DropdownMenuItem>
                                        <Link href={`/profile/${user?.username}`} className='flex flex-row'>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    :
                                    <DropdownMenuItem>
                                        <Link href={`/auth?redirect=${craftData.craftId}`} className='flex flex-row'>
                                            <LogIn className="mr-2 h-4 w-4" />
                                            <span>Log In</span>
                                        </Link>
                                    </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className='flex flex-col flex-1'>
                <div ref={codeEditorRef} style={{ height: codeEditorHeight * 100 + '%' }} id='code-editor' className='flex flex-row'>
                    <div className='w-3 border-slate-500 border-l border-r'></div>
                    <CodeEditor isSaved={html == craftData.html} ref={htmlPanelRef} width={panelWidths[0]} type='html' value={html} update={updateHtml} />
                    <div id='html-css-resizer' onMouseDown={(e) => handleResizePanels(0, e.clientX)} className='w-3 border-slate-500 border-l border-r cursor-col-resize'></div>
                    <CodeEditor isSaved={css == craftData.css} ref={cssPanelRef} width={panelWidths[1]} type='css' value={css} update={updateCss} />
                    <div id='css-js-resizer' onMouseDown={(e) => handleResizePanels(1, e.clientX)} className='w-3 border-slate-500 border-l border-r cursor-col-resize'></div>
                    <CodeEditor isSaved={js == craftData.js} ref={jsPanelRef} width={panelWidths[2]} type='js' value={js} update={updateJs} />
                </div>
                <div id='code-editor-resizer' className='h-3 w-full border-slate-500 border cursor-row-resize'></div>
                <div className="flex-1 relative overflow-hidden">
                    <Preview html={html} css={css} js={js} />
                </div>
            </main>
        </>
    )
}
