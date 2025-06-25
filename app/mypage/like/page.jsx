"use client";

import { useUser } from "@/context/UserContext";
import { useLikedStudies } from "@/hooks/useLikedStudies";
import LikeSideCard from "@/components/card/likeSideCard";
import { getSubjectNm } from "@/shared/utils";

export default function Like() {
  const { user } = useUser();
  const { likedStudies, loading } = useLikedStudies(user?.id, { fetchDetails: true });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">좋아요 누른 스터디 목록</h1>
      {likedStudies.length === 0 ? (
        <p className="text-gray-500">좋아요 누른 스터디가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedStudies.map((study) => (
            <LikeSideCard
              key={study.id}
              tag={getSubjectNm(item.subjectArea?.id)}
              content={study.title}
              leader={study.leader?.id ?? "리더"}
              detail={study.id}
              url={`?tab=intro`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
