"use client"
import { useEffect, useState } from "react"

export default function Preview(props: { html: string, css: string, js: string }) {
    const [srcDoc, setSrcDoc] = useState<string>("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            const code: string = `
            <!DOCTYPE html>
            <html lang="en" class>
               <head>
                    <meta charset="UTF-8">
                    <title>PenCraft Demo</title>
                    <style>${props.css}</style>
               </head>
              <body>${props.html}</body>
              <script>${props.js}</script>
            </html>
            `
            setSrcDoc(code);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [props]);


    return (
        <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation "
            frameBorder="0"
            width={"100%"}
            height="100%"
            allowFullScreen={true}
            allow='accelerometer; camera; encrypted-media; display-capture; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; web-share'
            name='PenCraft'
            loading='lazy'
            className='z-[1] border-0 w-full h-full absolute top-0 left-0'
        ></iframe>
    )
}
