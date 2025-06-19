"use client";

import { useEffect, useState } from "react";
import LikeSideCard from "@/components/card/likeSideCard";
import { useRouter } from "next/navigation";

export default function Like() {
  const [likedStudies, setLikedStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedStudies = async () => {
      try {
        // 1. 유저 정보 조회
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) {
          alert("로그인이 필요합니다.");
          router.push("/");
          return;
        }

        const user = await userRes.json();

        // 2. 관심 스터디 목록 조회
        const likedRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interested-studies/user/${user.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!likedRes.ok) throw new Error("관심 스터디 조회 실패");

        const likedData = await likedRes.json();
        const studyIds = likedData.data.map((item) => item.studyGroup.id);

        // 3. 각 스터디 ID로 상세 조회 API 호출
        const studyDetails = await Promise.all(
          studyIds.map(async (id) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/public/${id}`, {
              method: "GET",
              credentials: "include",
            });

            if (!res.ok) return null;

            const data = await res.json();
            return data.data; // 스터디 상세 객체
          })
        );

        // 4. null 값 제거
        const validStudies = studyDetails.filter(Boolean);
        setLikedStudies(validStudies);
      } catch (error) {
        console.error("스터디 조회 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedStudies();
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
              tag={study.keywords?.[0] ?? "태그"}
              content={study.title}
              leader={study.leader?.id ?? "리더"}
              detail={study.id}
              url={`?tab=intro`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
