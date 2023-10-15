
type HeaderProps = {
    name?: string,
    createdBy?: string
}

export default function Header(props : HeaderProps) {
    return (
        <header className="border-b border-slate-500 flex flex-row justify-between px-4 py-2">
            <div className="flex flex-col space-y-2">
                <span>{props.name ?? "CodeCraft Demo"}</span>
                <span>{props.createdBy ?? "Your name"}</span>
            </div>
        </header>
    )
}
