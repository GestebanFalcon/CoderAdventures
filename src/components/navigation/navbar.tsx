import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex h-20 w-full bg-sky-200 shadow-md">
            <div id="links" className="ml-12 mr-auto h-full flex justify-center items-center text-yellow-500 text-lg font-medium gap-2">
                <Link href="/info" className="flex  justify-center items-center mx-8 font-medium">
                    <img src="/palmTree.png" className=" object-scale-down h-12"></img>
                </Link>
                <Link href="/info/map" >Roadmap</Link>
            </div>
            <div id="userActions" className="w-48 h-full ml-auto">
                <Link href="/info/code"><div className="flex justify-center items-center bg-yellow-300 h-full text-blue-950 font-bold text-4xl italic">START</div></Link>
            </div>
        </nav>
    )
}