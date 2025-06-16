"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import StudyIntro from "@/app/(pages)/studyGroup/components/studyIntro";
import StudyMembers from "@/app/(pages)/studyGroup/components/studyMembers";
import Enrollment from "@/app/(pages)/studyGroup/components/enrollment";
import Manage from "@/app/(pages)/studyGroup/components/manage";

export default function StudyGroup() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "intro";

  const [study, setStudy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) {
      console.warn("라우팅 ID가 존재하지 않습니다.");
      setIsLoading(false);
      return;
    }

    const fetchStudyById = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-groups/public/${params.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("스터디 조회 실패");
        const data = await res.json();
        setStudy(data.data);
      } catch (err) {
        console.error("스터디 조회 에러:", err);
        setStudy(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyById();
  }, [params?.id]);

  if (isLoading) return <p className="text-center p-10">로딩 중...</p>;
  if (!study) return <p className="text-center p-10 text-red-500">스터디를 찾을 수 없습니다</p>;

  return (
    <div className="w-full h-full flex flex-col bg-white px-24">
      <Navbar />
      <div className="p-10 space-y-8 text-black">
        {tab === "intro" && <StudyIntro study={study} />}
        {tab === "members" && <StudyMembers study={study} />}
        {tab === "enrollment" && <Enrollment study={study} />}
        {tab === "manage" && <Manage study={study} />}
      </div>
    </div>
  );
}
