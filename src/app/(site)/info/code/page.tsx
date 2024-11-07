import Card from "@/components/util/card";
import CardHolder from "@/components/util/cardHolder";

export default function Code() {
    return (
        <div className="w-full p-12">
            <section className="flex flex-col items-center rounded-md opacity-80 bg-blue-200 w-full h-full p-12">
                <CardHolder>
                    <Card imageUrl="https://i.postimg.cc/pLLQKQFD/topdowd-tileset-prev.png" adventureName="beta" heading="Adventure 1" content="Coderbot has woken up on a mysterious island. Learn the fundamentals by writing code to navigate this new, strange world." />
                </CardHolder>
            </section>
        </div>
    )
}