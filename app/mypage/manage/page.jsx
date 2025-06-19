"use client";

import { useUser } from "@/context/UserContext";
import { useLeaderStudies } from "@/hooks/useLeaderStudies";
import StudySideCard from "@/components/card/studySideCard";

export default function Manage() {
  const { user } = useUser();
  const leaderStudies = useLeaderStudies(user?.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🧑‍💼 관리 중인 스터디</h1>
      {leaderStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaderStudies.map((group) => (
            <StudySideCard
              key={group.id}
              id={group.id}
              tag={group.keywords?.[0]}
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
