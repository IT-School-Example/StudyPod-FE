"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import StudyIntro from "../components/StudyIntro";
import StudyMembers from "../components/StudyMembers";

export default function StudyGroup({ params }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "intro";

  const [study, setStudy] = useState(null);

  useEffect(() => {
    fetch("/studyData.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const matched = data.find((item) => item.detail === params.detail);
        //console.log(params.detail);
        //console.log(matched);
        setStudy(matched);
      })
      .catch((err) => {
        console.error("Error fetching studyData.json", err);
      });
  }, [params.detail]);

  if (study === null) return <p>로딩 중...</p>;
  if (!study) return <p>스터디를 찾을 수 없습니다</p>;

  return (
    <div className="w-full h-full flex flex-col bg-white px-24">
      <Navbar />
      <div className="p-10 space-y-8 text-black">
        {tab === "intro" && <StudyIntro study={study} />}
        {tab === "members" && <StudyMembers study={study} />}
      </div>
    </div>
  );
}
