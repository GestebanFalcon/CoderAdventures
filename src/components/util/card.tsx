import Image from "next/image";
import Link from "next/link";

export default function Card({ heading, content, imageUrl, adventureName }: { heading: string, content: string, imageUrl?: string, adventureName: string }) {
    return (
        <section className="flex flex-col items-start rounded-sm h-128 w-80 bg-blue-100 opacity-100 border-slate-950 border-2 shadow-md p-8 mx-8">
            <h1 className=" mt-8 text-2xl font-semibold italic mb-4 object-cover">{heading}</h1>
            {imageUrl ? (
                <div className="h-32 object-cover overflow-hidden">
                    <img src="https://i.postimg.cc/pLLQKQFD/topdowd-tileset-prev.png" ></img>
                </div>
            ) :
                (
                    <div className="h-32 w-full bg-gray-400"></div>
                )
            }
            <p className="my-2 text-base font-normal">{content}</p>
            <Link href={`/levels/${adventureName}/1`} className=" w-full mt-4"><div className="text-center text-xl font-medium p-4 w-full h-16 rounded-2xl bg-yellow-400">Play Now</div></Link>
        </section>
    )
}