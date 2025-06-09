"use client";

import { useEffect, useState } from "react";
import StudySideCard from "@/app/components/card/studySideCard";

export default function Belong() {
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

  const memberGroups = studyData.filter(
    (item) =>
      item.member?.role_member?.includes(name) ||
      item.member?.role_leader?.includes(name)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👥 소속된 스터디</h1>
      {memberGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memberGroups.map((group) => (
            <StudySideCard
              key={group.id}
              tag={group.tag}
              detail={group.detail}
              isLeader={group.member.role_leader?.includes(name)}
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
