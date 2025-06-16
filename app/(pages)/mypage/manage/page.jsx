"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudySideCard from "@/app/components/card/studySideCard";

export default function Manage() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [studyData, setStudyData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("회원 정보를 불러올 수 없습니다.");

        const json = await res.json();
        setName(json.name);
        setUserId(json.id);

        // 리더인 스터디 그룹 조회
        const groupRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-groups/leader/${json.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!groupRes.ok) throw new Error("스터디 그룹 조회 실패");

        const groupJson = await groupRes.json();
        setStudyData(groupJson.data || []);
      } catch (err) {
        console.error(err);
        alert("로그인이 필요합니다.");
        router.push("/login");
      }
    };

    fetchUserInfo();
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🧑‍💼 관리 중인 스터디</h1>
      {studyData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyData.map((group) => (
            <StudySideCard
              key={group.id}
              id={group.id}
              tag={group.keywords[0]}
              detail={group.title}
              isLeader={true}
              url={`?tab=manage`}
            />
          ))}
        </div>
      ) : (
        <p>현재 관리 중인 스터디가 없습니다.</p>
      )}
    </div>
  );
}
