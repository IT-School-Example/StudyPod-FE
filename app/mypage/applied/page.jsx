"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IntroSideCard from "@/components/card/introSideCard";
import { useUser } from "@/context/UserContext";

export default function Applied() {
  const { user } = useUser();
  const [appliedStudies, setAppliedStudies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppliedStudies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-groups/user/${user.id}/enrolled-groups?enrollmentStatus=PENDING`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("신청한 스터디를 불러올 수 없습니다.");

        const json = await res.json();
        setAppliedStudies(json.data || []);
      } catch (err) {
        console.error("데이터 조회 오류:", err);
        router.push("/login");
      }
    };

    fetchAppliedStudies();
  }, [router]);
  
  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl font-bold text-black mb-6">신청한 스터디 목록</h1>
      {appliedStudies.length > 0 ? (
        appliedStudies.map((study) => (
          <IntroSideCard
            key={study.id}
            studyTitle={study.title}
            introduce={study.description}
          />
        ))
      ) : (
        <p className="text-gray-500">신청한 스터디가 없습니다.</p>
      )}
    </div>
  );
}
