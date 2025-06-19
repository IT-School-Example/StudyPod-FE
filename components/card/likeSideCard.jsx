"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";

export default function LikeSideCard({ tag, content, leader, detail, url }) {
  const [leaderName, setLeaderName] = useState("로딩 중...");

  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${leader}/summary`, {
          credentials: "include",
        });
        const data = await res.json();
        setLeaderName(data.data.displayName);
      } catch (err) {
        console.error("리더 이름 조회 실패:", err);
        setLeaderName("알 수 없음");
      }
    };

    if (leader) fetchDisplayName();
  }, [leader]);

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
          <span>리더: {leaderName}</span>
          <span className="flex items-center gap-1">
            <FaHeart className="text-red-500" />
          </span>
        </div>
      </div>
    </Link>
  );
}
