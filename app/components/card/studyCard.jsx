"use client";

import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function StudyCard({
  tag,
  content,
  leader,
  detail,
  url,
  initiallyLiked = false,
}) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [interestedId, setInterestedId] = useState(null);
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

  useEffect(() => {
    if (!initiallyLiked) return;

    const fetchInterestedId = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) return;
        const user = await userRes.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interested-studies/user/${user.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) return;
        const data = await res.json();

        const found = data.data.find(
          (item) => item.studyGroup.id === detail && !item.isDeleted
        );

        if (found) setInterestedId(found.id);
      } catch (err) {
        console.error("관심 ID 조회 실패:", err);
      }
    };

    fetchInterestedId();
  }, [initiallyLiked, detail]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!userRes.ok) {
        alert("로그인이 필요합니다.");
        return;
      }

      const user = await userRes.json();
      const userId = user.id;

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
              user: { id: userId },
              studyGroup: { id: detail },
            },
          }),
        });

        if (!res.ok) {
          alert("관심 등록에 실패했습니다.");
          return;
        }

        const result = await res.json();
        setInterestedId(result.data.id);
        setLiked(true);
      } else {
        if (!interestedId) {
          alert("관심 항목 ID를 찾을 수 없습니다.");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interested-studies/${interestedId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!res.ok) {
          alert("관심 해제에 실패했습니다.");
          return;
        }

        setLiked(false);
        setInterestedId(null);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
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
            <h1 className="py-2">{leaderName}</h1>
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
