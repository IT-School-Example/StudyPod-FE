"use client";

import { useEffect, useState } from "react";
import LikeSideCard from "@/app/components/card/likeSideCard";
import { useRouter } from "next/navigation";

export default function Like() {
  const [likedStudies, setLikedStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === currentEmail);
    if (user) setName(user.name);

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const likeRes = await fetch("/studyLikes.json");
        const likeData = await likeRes.json();

        const studyRes = await fetch("/studyData.json");
        const studyList = await studyRes.json();

        // 현재 유저가 좋아요 누른 studyDetail 목록 추출
        const likedIds = likeData.filter(
            (item) => item.likedUsers?.filter(Boolean).includes(user.name)
          )
          .map((item) => item.studyDetail);

        // studyData에서 likedIds에 해당하는 것만 필터링
        const likedList = studyList.filter((study) =>
          likedIds.includes(study.detail)
        );

        setLikedStudies(likedList);
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">좋아요 누른 스터디 목록</h1>
      {likedStudies.length === 0 ? (
        <p className="text-gray-500">좋아요 누른 스터디가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedStudies.map((study) => (
            <LikeSideCard
              key={study.id}
              tag={study.tag}
              content={study.content}
              leader={study.leader}
              like={study.like}
              detail={study.detail}
              url={`?tab=intro`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
