import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

export default function Card({ tag, content, name, like, detail }) {
  return (
    <Link href={`/${detail}`}>
      <div className="flex flex-col p-4 w-72 h-72 space-y-3 border-2 justify-between border-black rounded-xl hover:scale-105 hover:border-blue-300 transition">
        <div className="space-y-3 justify-between">
          <div className="items-center rounded-xl inline-block justify-center px-4 py-2 text-black bg-[#FBEDD7]">
            <h1>{tag}</h1>
          </div>
          <h1 className="font-bold text-black">{content}</h1>
        </div>
        <div>
          <div className="bg-black h-0.5 mb-2" />
          <div className="flex flex-row justify-between text-black font-bold">
            <h1 className="py-2">{name}</h1>
            <div className="flex flex-row items-center space-x-1 justify-center bg-gray-300 px-4 py-2 rounded-xl">
              <FaHeart />
              <h1>{like}</h1>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
