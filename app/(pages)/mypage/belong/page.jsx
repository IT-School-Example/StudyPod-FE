"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudySideCard from "@/app/components/card/studySideCard";

export default function Belong() {
  const [userId, setUserId] = useState(null);
  const [studyData, setStudyData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        // 사용자 정보 조회
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) throw new Error("회원 정보를 불러올 수 없습니다.");

        const user = await userRes.json();
        setUserId(user.id);

        // 두 API 병렬 호출
        const [leaderRes, memberRes] = await Promise.allSettled([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/leader/${user.id}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/my`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId: user.id }),
          }),
        ]);

        const leaderData =
          leaderRes.status === "fulfilled" && leaderRes.value.ok
            ? (await leaderRes.value.json()).data || []
            : [];

        const memberData =
          memberRes.status === "fulfilled" && memberRes.value.ok
            ? (await memberRes.value.json()).data || []
            : [];

        // 중복 제거
        const combined = [...leaderData, ...memberData].filter(
          (study, index, self) => index === self.findIndex((s) => s.id === study.id)
        );

        setStudyData(combined);
      } catch (err) {
        console.error("스터디 데이터 조회 실패:", err);
        alert("로그인이 필요합니다.");
        router.push("/login");
      }
    };

    fetchStudies();
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👥 소속된 스터디</h1>
      {studyData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyData.map((group) => (
            <StudySideCard
              key={group.id}
              id={group.id}
              tag={group.keywords[0]}
              detail={group.title}
              isLeader={group.leader.id === userId}
              url={`?tab=members`}
            />
          ))}
        </div>
      ) : (
        <p>현재 소속된 스터디가 없습니다.</p>
      )}
    </div>
  );
}
