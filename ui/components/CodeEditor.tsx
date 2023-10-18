import React, { forwardRef, ForwardedRef } from 'react';
import Editor from '@monaco-editor/react';
import jsIcon from "@/public/assets/js.svg";
import htmlIcon from "@/public/assets/html.svg";
import cssIcon from "@/public/assets/css.svg";
import Image from 'next/image';

interface CodeEditorProps {
    update: (js: string) => void;
    type: 'js' | 'html' | 'css';
    width: number;
    value: string | undefined;
    isSaved : boolean | false;
}

const CodeEditor = forwardRef((props: CodeEditorProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { update, type, width, value, isSaved } = props;

    function handleChange(e: string | undefined) {
        if (e) {
            update(e);
        }
    }

    return (
        <div ref={ref} id={`box-${type}`} className='w-1/3 overflow-hidden' style={{ width: width * 100 + "%" }} datatype={type} >
            <div className='flex pt-1 px-2 items-center gap-4'>
                <div className='flex flex-row gap-2 bg-[#1e1e1e] p-1 rounded-t-md'>
                    <Image
                        src={type === "js" ? jsIcon : type === "css" ? cssIcon : htmlIcon}
                        alt={type}
                    />
                    <span className='uppercase'>{type}</span>
                </div>
                {!isSaved && <span className='text-sm text-slate-500'>( Unsaved )</span>}
            </div>
            <Editor
                height={"50vh"}
                defaultLanguage={type === "js" ? "javascript" : type}
                value={value}
                onChange={handleChange}
                theme="vs-dark"
            />
        </div>
    );
});

export default CodeEditor;
