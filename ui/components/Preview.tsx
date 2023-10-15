export default function Preview({ srcDoc }: { srcDoc: string }) {
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
