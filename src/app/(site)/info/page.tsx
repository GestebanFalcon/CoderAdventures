import Link from "next/link";

export default function Info() {
    return (
        <div id="infoContainer">
            <div className="flex m-48">
                <section className="w-3/5 flex content-center items-start flex-col">
                    <h1 className=" p-auto font-semibold text-5xl mb-4">Have Fun While Learning</h1>
                    <p className=" font-medium text-2xl mb-8"> An educational experience at your fingertips. Expose yourself to coding with the familiarity of games and the thrill of adventure</p>
                    <Link href="/info/code"><div className=" text-xl font-medium rounded-full bg-blue-950 text-yellow-100 p-4">Start Now!</div></Link>
                </section>
                <section className="w-2/5 px-16 pt-0">
                    <img src="/robot .png" className=" h-full w-full object-contain scale-x-[-1]"></img>
                </section>
            </div>

        </div>
    )
}