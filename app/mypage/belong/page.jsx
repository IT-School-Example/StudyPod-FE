"use client";

import { useUser } from "@/context/UserContext";
import { useMyStudies } from "@/hooks/useMyStudies";
import StudySideCard from "@/components/card/studySideCard";
import { getSubjectNm } from "@/shared/utils";

export default function Belong() {
  const { user } = useUser();
  const myStudies = useMyStudies(user?.id); 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👥 소속된 스터디</h1>
      {myStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myStudies.map((group) => (
            <StudySideCard
              key={group.id}
              id={group.id}
              tag={getSubjectNm(item.subjectArea?.id)}
              detail={group.title}
              isLeader={group.leader.id === user.id}
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