"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import StudyCard from "@/app/components/card/studyCard";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [offset, setOffset] = useState({ y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studyData, setStudyData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [myStudies, setMyStudies] = useState([]);
  const [leaderStudies, setLeaderStudies] = useState([]);
  const [interestedStudyIds, setInterestedStudyIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      const user = localStorage.getItem("currentUser");
      setIsLoggedIn(!!user);

      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) throw new Error("유저 정보 불러오기 실패");
        const userData = await userRes.json();
        const id = userData.id;
        setUserId(id);

        // 관심 스터디 조회
        const interestedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interested-studies/user/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (interestedRes.ok) {
          const interestedData = await interestedRes.json();
          const ids = interestedData.data.map((item) => item.studyGroup.id);
          setInterestedStudyIds(ids);
        }

        // 소속 스터디 조회 (/my 기준)
        const myRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/my?userId=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (myRes.ok) {
          const myData = await myRes.json();
          setMyStudies(myData.data || []);
        }

        // 리더 스터디 조회
        const leaderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/leader/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (leaderRes.ok) {
          const leaderData = await leaderRes.json();
          setLeaderStudies(leaderData.data || []);
        }

        // 전체 스터디
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups`, {
          method: "GET",
          credentials: "include",
        });

        if (allRes.ok) {
          const allData = await allRes.json();
          setStudyData(allData.data || []);
        }
      } catch (err) {
        console.error("초기 데이터 불러오기 실패:", err);
      }
    };

    fetchInitialData();
  }, []);

  const myIds = new Set([
    ...(Array.isArray(myStudies) ? myStudies : []),
    ...(Array.isArray(leaderStudies) ? leaderStudies : []),
  ].map((s) => s.id));

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
            style={{
              transform: `translate(0px, ${offset.y}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <Image
              src="/banner.png"
              alt="banner"
              width={1700}
              height={384}
              priority
              className="object-cover brightness-50"
            />
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <>
          {leaderStudies.length > 0 && (
            <section className="py-10">
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl text-black">관리 스터디</h1>
                <Link href="/mypage/manage" className="text-sm text-gray-500">
                  전체 보기
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-5">
                {leaderStudies.map((item) => (
                  <StudyCard
                    key={item.id}
                    detail={item.id}
                    tag={item.keywords?.[0]}
                    content={item.title}
                    leader={item.leader?.id}
                    initiallyLiked={interestedStudyIds.includes(item.id)}
                    url="?tab=manage"
                  />
                ))}
              </div>
            </section>
          )}

          {myStudies.length > 0 && (
            <section className="py-10">
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl text-black">소속 스터디</h1>
                <Link href="/mypage/belong" className="text-sm text-gray-500">
                  전체 보기
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-5">
                {myStudies.map((item) => (
                  <StudyCard
                    key={item.id}
                    detail={item.id}
                    tag={item.keywords?.[0]}
                    content={item.title}
                    leader={item.leader?.id}
                    initiallyLiked={interestedStudyIds.includes(item.id)}
                    url="?tab=members"
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="py-10">
        <h1 className="font-bold text-4xl text-black">추천 스터디 그룹</h1>
        <div className="flex flex-wrap gap-6 mt-5">
          {recommendedGroups.map((item) => (
            <StudyCard
              key={item.id}
              detail={item.id}
              tag={item.keywords?.[0]}
              content={item.title}
              leader={item.leader?.id}
              initiallyLiked={interestedStudyIds.includes(item.id)}
              url="?tab=intro"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
