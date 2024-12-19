import Link from "next/link";

export default function LevelNavbar() {
    const levels = [1, 2, 3]
    return (
        <nav className="flex h-20 w-full bg-sky-200 shadow-md">
            <div id="links" className="ml-12 mr-auto h-full flex justify-center items-center text-yellow-500 text-xl">
                <Link href="/info" className="flex  justify-center items-center mx-8 font-semibold text-2xl">
                    <img src="/palmTree.png" className=" object-scale-down h-12 mx-2"></img>
                </Link>
                {/* <Link href="/levels/editor/?levelNumber=1">Edit</Link> */}
            </div>
            <div className=" h-full p-4">
                <div className=" bg-slate-400 h-full mx-auto rounded-full border-blue-950 border-2 flex p-2 gap-2">
                    {levels.map((level, index) => (
                        <Link href={`/levels/beta/${level}`} className="rounded-full border-2 font-semibold px-2 bg-yellow-500" key={index}>{level}</Link>
                    ))}
                </div>
            </div>
            <div id="userActions" className="w-48 h-full ml-auto">
            </div>
        </nav>
    )
}