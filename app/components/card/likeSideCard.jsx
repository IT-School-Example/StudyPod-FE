"use client";

import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

export default function LikeSideCard({ tag, content, leader, detail, url }) {
  return (
    <Link href={`/studyGroup/${detail}${url ?? ""}`}>
      <div className="p-4 w-full border-2 border-black rounded-xl hover:border-blue-300 hover:scale-105 transition">
        <div className="mb-3">
          <div className="inline-block px-3 py-1 text-sm bg-[#FBEDD7] rounded-xl mb-2">
            {tag}
          </div>
          <h2 className="font-bold text-lg text-black">{content}</h2>
        </div>
        <div className="border-t border-gray-300 pt-2 flex justify-between items-center text-sm text-black">
          <span>리더: {leader}</span>
          <span className="flex items-center gap-1">
            <FaHeart className="text-red-500" />
          </span>
        </div>
      </div>
    </Link>
  );
}
