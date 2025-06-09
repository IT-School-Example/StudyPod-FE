"use client";

import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function StudyCard({ tag, content, leader, like, detail, url }) {
  const [likeCount, setLikeCount] = useState(like);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setName] = useState("");

  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === currentEmail);
    
    if (user) setName(user.name);
    
    if (!user) {
      setLiked(false);
      setLoading(false);
      return;
    }

    async function fetchLikes() {
      try {
        const res = await fetch("/api/studyLikes");
        if (!res.ok) throw new Error("Failed to fetch likes");
        const studyLikes = await res.json();
        const current = studyLikes.find((item) => item.studyDetail === detail);
        if (current) {
          setLiked(current.likedUsers.includes(user));
          setLikeCount(current.likedUsers.length);
        } else {
          setLiked(false);
          setLikeCount(0);
        }
      } catch (error) {
        console.error(error);
        setLiked(false);
        setLikeCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchLikes();
  }, [detail, user]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return alert("로그인이 필요합니다.");

    const action = liked ? "unlike" : "like";

    try {
      const res = await fetch("/api/studyLikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studyDetail: detail,
          userName : user,
          action,
        }),
      });

      if (!res.ok) {
        alert("좋아요 처리에 실패했습니다.");
        return;
      }

      // 성공하면 상태 업데이트
      setLiked(!liked);
      setLikeCount((count) => (action === "like" ? count + 1 : Math.max(count - 1, 0)));

      // 만약 localStorage에 studyGroups가 있으면 좋아요 수도 동기화
      const groups = JSON.parse(localStorage.getItem("studyGroups")) || [];
      const updatedGroups = groups.map((g) =>
        g.id === detail
          ? { ...g, like: action === "like" ? likeCount + 1 : Math.max(likeCount - 1, 0) }
          : g
      );
      localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

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
            <h1 className="py-2">{leader}</h1>
            <button
              onClick={handleLike}
              className="flex flex-row items-center space-x-1 justify-center bg-gray-300 px-4 py-2 rounded-xl hover:bg-pink-200"
            >
              <FaHeart className={liked ? "text-red-500" : "text-gray-600"} />
              <h1>{likeCount}</h1>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
