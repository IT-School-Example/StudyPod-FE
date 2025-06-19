"use client";

import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import UserName from "@/components/UserName";

export default function StudyCard({
  tag,
  content,
  leader,
  detail,
  url,
  initiallyLiked,
  interestedId,
  setLikedMap, // 좋아요 변경 시 부모 상태 업데이트용
}) {
  const { user } = useUser();
  const [liked, setLiked] = useState(initiallyLiked);
  const [interested, setInterested] = useState(interestedId);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (!liked) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interested-studies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            data: {
              user: { id: user.id },
              studyGroup: { id: detail },
            },
          }),
        });

        if (!res.ok) throw new Error("관심 등록 실패");

        const result = await res.json();
        const newId = result.data.id;
        setInterested(newId);
        setLiked(true);
        setLikedMap?.((prev) => ({ ...prev, [detail]: newId }));
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interested-studies/${interested}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("관심 해제 실패");

        setLiked(false);
        setInterested(null);
        setLikedMap?.((prev) => {
          const map = { ...prev };
          delete map[detail];
          return map;
        });
      }
    } catch (err) {
      console.error("관심 토글 에러:", err);
    }
  };

  return (
    <Link href={`/studyGroup/${detail}${url ?? ""}`}>
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
            <h1 className="py-2">
              <UserName userId={leader} />
            </h1>
            <button
              onClick={handleLike}
              className="flex flex-row items-center space-x-1 justify-center bg-gray-300 px-4 py-2 rounded-xl hover:bg-pink-200"
            >
              <FaHeart className={liked ? "text-red-500" : "text-gray-600"} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}