"use client";

import { useEffect, useState } from "react";
import IntroSideCard from "@/app/components/card/introSideCard";

export default function Applied() {
  const [appliedStudies, setAppliedStudies] = useState([]);
  const [studyData, setStudyData] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === currentEmail);
    if (user) setUserName(user.name);

    const fetchData = async () => {
      try {
        const joinRes = await fetch("/joinMemberList.json");
        const joinData = await joinRes.json();

        const studyRes = await fetch("/studyData.json");
        const studyList = await studyRes.json();
        setStudyData(studyList);

        const filtered = joinData.filter(
          (item) => item.user === user?.name && item.status === "pending"
        );

        setAppliedStudies(filtered);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    fetchData();
  }, []);

  const getStudyTitle = (detailId) => {
    const study = studyData.find((s) => s.detail === detailId);
    return study ? study.tag : "알 수 없는 스터디";
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl font-bold text-black mb-6">신청한 스터디 목록</h1>
      {appliedStudies.length > 0 ? (
        appliedStudies.map((item) => (
          <IntroSideCard
            key={item.id}
            studyTitle={getStudyTitle(item.studyDetail)}
            introduce={item.introduce}
          />
        ))
      ) : (
        <p className="text-gray-500">신청한 스터디가 없습니다.</p>
      )}
    </div>
  );
}
