"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import ScrollButton from "@/components/common/ScrollButton";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";
import Navbar from "@/components/common/Navbar";
import { getSubjectNm } from "@/shared/utils";
import StudyCard from "@/components/card/studyCard";
import { useLikedStudies } from "@/hooks/useLikedStudies";
import { useLeaderStudies } from "@/hooks/useLeaderStudies";
import { useMyStudies } from "@/hooks/useMyStudies";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const [offset, setOffset] = useState({ y: 0 });
  const [studyData, setStudyData] = useState([]);
  const myStudies = useMyStudies(user?.id);
  const leaderStudies = useLeaderStudies(user?.id);
  const { likedMap, setLikedMap } = useLikedStudies(user?.id, { fetchDetails: false });

  const leaderScrollRef = useDraggableScroll();
  const myScrollRef = useDraggableScroll();

  useEffect(() => {
    const fetchAllStudies = async () => {
      try {
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups`, {
          method: "GET",
          credentials: "include",
        });

        if (allRes.ok) {
          const allData = await allRes.json();
          setStudyData(allData.data || []);
        }
      } catch (err) {
        console.error("전체 스터디 불러오기 실패:", err);
      }
    };

    fetchAllStudies();
  }, []);

  const combinedStudies = [
    ...(Array.isArray(myStudies) ? myStudies : []),
    ...(Array.isArray(leaderStudies) ? leaderStudies : []),
  ];
  const mergedMyStudies = Array.from(new Map(combinedStudies.map((s) => [s.id, s])).values());
  const myIds = new Set(mergedMyStudies.map((s) => s.id));
  const recommendedGroups = studyData.filter((s) => !myIds.has(s.id));

  const handleMouseMove = (e) => {
    const { top, height } = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - top) / height - 0.5) * 20;
    setOffset({ y });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white px-24">
      <Navbar />

      <div className="w-full h-96 bg-white">
        <div
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden h-[384px] w-full flex items-center justify-center rounded-lg"
        >
          <div
            className="transition-transform duration-100"
            style={{ transform: `translate(0px, ${offset.y}px)`, transition: "transform 0.3s ease-out" }}
          >
            <Image src="/banner.png" alt="banner" width={1700} height={384} priority className="object-cover brightness-50" />
          </div>
        </div>
      </div>

      {user && leaderStudies.length > 0 && (
        <section className="py-10 mt-10 relative">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-4xl text-black">관리 스터디</h1>
            <Link href="/mypage/manage" className="text-sm text-gray-500">전체 보기</Link>
          </div>
          <ScrollButton direction="left" onClick={() => leaderScrollRef.current.scrollLeft -= 300} />
          <ScrollButton direction="right" onClick={() => leaderScrollRef.current.scrollLeft += 300} />
          <div ref={leaderScrollRef} className="overflow-hidden cursor-grab select-none">
            <div className="flex gap-4 flex-nowrap items-start py-4">
              {leaderStudies.map((item) => (
                <StudyCard
                  key={item.id}
                  detail={item.id}
                  tag={getSubjectNm(item.subjectArea?.id)}
                  content={item.title}
                  leader={item.leader?.id}
                  url="?tab=manage"
                  initiallyLiked={!!likedMap[item.id]}
                  interestedId={likedMap[item.id]}
                  setLikedMap={setLikedMap}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {user && mergedMyStudies.length > 0 && (
        <section className="py-10 mt-10 relative">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-4xl text-black">소속 스터디</h1>
            <Link href="/mypage/belong" className="text-sm text-gray-500">전체 보기</Link>
          </div>
          <ScrollButton direction="left" onClick={() => myScrollRef.current.scrollLeft -= 300} />
          <ScrollButton direction="right" onClick={() => myScrollRef.current.scrollLeft += 300} />
          <div ref={myScrollRef} className="overflow-hidden cursor-grab select-none">
            <div className="flex gap-4 flex-nowrap items-start py-4">
              {mergedMyStudies.map((item) => (
                <StudyCard
                  key={item.id}
                  detail={item.id}
                  tag={getSubjectNm(item.subjectArea?.id)}
                  content={item.title}
                  leader={item.leader?.id}
                  url="?tab=members"
                  initiallyLiked={!!likedMap[item.id]}
                  interestedId={likedMap[item.id]}
                  setLikedMap={setLikedMap}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 mt-10 relative">
        <h1 className="font-bold text-4xl text-black">추천 스터디 그룹</h1>
        <div className="flex flex-wrap gap-6 mt-5">
          {recommendedGroups.map((item) => (
            <StudyCard
              key={item.id}
              detail={item.id}
              tag={getSubjectNm(item.subjectArea?.id)}
              content={item.title}
              leader={item.leader?.id}
              url="?tab=intro"
              initiallyLiked={!!likedMap[item.id]}
              interestedId={likedMap[item.id]}
              setLikedMap={setLikedMap}
            />
          ))}
        </div>
      </section>
    </div>
  );
}