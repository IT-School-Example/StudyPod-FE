"use client";

import { useEffect, useState } from "react";
import StudySideCard from "@/app/components/card/studySideCard";

export default function Manage() {
  const [name, setName] = useState("");
  const [studyData, setStudyData] = useState([]);

  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === currentEmail);
    if (user) setName(user.name);

    fetch("/studyData.json")
      .then((res) => res.json())
      .then((data) => setStudyData(data));
  }, []);

  const leaderGroups = studyData.filter((item) =>
    item.member?.role_leader?.includes(name)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🧑‍💼 관리 중인 스터디</h1>
      {leaderGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaderGroups.map((group) => (
            <StudySideCard
              key={group.id}
              tag={group.tag}
              detail={group.detail}
              isLeader={true}
            />
          ))}
        </div>
      ) : (
        <p>현재 관리 중인 스터디가 없습니다.</p>
      )}
    </div>
  );
}
