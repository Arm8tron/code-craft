"use client"

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import { DEFAULT_CSS, DEFAULT_HTML, DEFAULT_JS } from '@/lib/constants';
import { CodeCraft } from '@/types/CodeCraft';
import Preview from '@/components/Preview';

export const getData = (async (craftId: string) => {
    const res = await fetch(`http://localhost:5023/api?craftId=${craftId}`);

    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res.json();
})

export default function Page({ params }: { params: { craftId: string } }) {
    const htmlPanelRef = useRef<HTMLDivElement>(null);
    const cssPanelRef = useRef<HTMLDivElement>(null);
    const jsPanelRef = useRef<HTMLDivElement>(null);
    const codeEditorRef = useRef<HTMLDivElement>(null);

    const [craftData, setCraftData] = useState<CodeCraft>();
    const [js, setJs] = useState<string>(DEFAULT_JS);
    const [html, setHtml] = useState<string>(DEFAULT_HTML);
    const [css, setCss] = useState<string>(DEFAULT_CSS);
    const [srcDoc, setSrcDoc] = useState<string>("");
    const [panelWidths, setPanelWidths] = useState<number[]>([0.33, 0.33, 0.33]);
    const [codeEditorHeight, setCodeEditorHeight] = useState<number>(0.5);

    useEffect(() => {
        getData(params.craftId).then(data => {
            const { html, css, js } = data || { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS };
            setCraftData(data);
            setHtml(html);
            setCss(css);
            setJs(js);
        }).catch(console.warn)
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const code: string = `
            <!DOCTYPE html>
            <html lang="en" class>
               <head>
                    <meta charset="UTF-8">
                    <title>PenCraft Demo</title>
                    <style>${css}</style>
               </head>
              <body>${html}</body>
              <script>${js}</script>
            </html>
            `
            setSrcDoc(code);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [js, html, css]);

    function saveCraft() {
        fetch("http://localhost:5023/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ html, css, js, name: "first", createdBy: "Anirudh", craftId: params.craftId })
        }).then(res => res.json())
            .then(console.log)
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

    return (
        <>
            <Header name={craftData?.name} createdBy={craftData?.createdBy} />
            <main className='flex flex-col flex-1'>
                <button onClick={saveCraft} className='bg-slate-300'>Save</button>
                <div ref={codeEditorRef} style={{ height: codeEditorHeight * 100 + '%' }} id='code-editor' className='flex flex-row'>
                    <div className='w-3 border-slate-500 border-l border-r'></div>
                    <CodeEditor ref={htmlPanelRef} width={panelWidths[0]} type='html' value={html} update={updateHtml} />
                    <div id='html-css-resizer' onMouseDown={(e) => handleResizePanels(0, e.clientX)} className='w-3 border-slate-500 border-l border-r cursor-col-resize'></div>
                    <CodeEditor ref={cssPanelRef} width={panelWidths[1]} type='css' value={css} update={updateCss} />
                    <div id='css-js-resizer' onMouseDown={(e) => handleResizePanels(1, e.clientX)} className='w-3 border-slate-500 border-l border-r cursor-col-resize'></div>
                    <CodeEditor ref={jsPanelRef} width={panelWidths[2]} type='js' value={js} update={updateJs} />
                </div>
                <div id='code-editor-resizer' className='h-3 w-full border-slate-500 border cursor-row-resize'></div>
                <div className="flex-1 relative overflow-hidden">
                    <Preview srcDoc={srcDoc}/>
                </div>
            </main>
        </>
    )
}
