"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    setIsLoggedIn(!!user);

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("유저 정보 불러오기 실패");
        const data = await res.json();
        setUserId(data.id);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAll = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        setStudyData(json.data || []);
      } catch (err) {
        console.error("전체 스터디 조회 실패:", err);
      }
    };

    fetchUser();
    fetchAll();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchInterested = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interested-studies/user/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("관심 스터디 조회 실패");

        const data = await res.json();
        const ids = data.data.map((item) => item.studyGroup.id);
        setInterestedStudyIds(ids);
      } catch (err) {
        console.error("관심 스터디 ID 조회 실패:", err);
      }
    };

    const fetchMy = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) throw new Error("회원 정보를 불러올 수 없습니다.");
        const user = await userRes.json();
        setUserId(user.id);

        const [leaderRes, memberRes] = await Promise.allSettled([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/leader/${user.id}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/my?userId=${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
        ]);

        const leaderData =
          leaderRes.status === "fulfilled" && leaderRes.value.ok
            ? (await leaderRes.value.json()).data || []
            : [];

        const memberData =
          memberRes.status === "fulfilled" && memberRes.value.ok
            ? (await memberRes.value.json()).data || []
            : [];

        const combined = [...leaderData, ...memberData].filter(
          (study, index, self) => index === self.findIndex((s) => s.id === study.id)
        );
        
        setMyStudies(combined);
      } catch (err) {
        console.error("스터디 데이터 조회 실패:", err);
        alert("로그인이 필요합니다.");
        router.push("/login");
      }
    };

    const fetchLeader = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-groups/leader/${userId}`,
          { method: "GET", credentials: "include" }
        );
        const json = await res.json();
        console.log(json.data)
        setLeaderStudies(json.data || []);
      } catch (err) {
        console.warn("리더 스터디 조회 실패:", err);
      }
    };

    fetchLeader();
    fetchInterested();
    fetchMy();
  }, [userId]);

  const myIds = new Set([...myStudies, ...leaderStudies].map((s) => s.id));
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
                    leader={`ID: ${item.leader?.id}`}
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
                    leader={`ID: ${item.leader?.id}`}
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
              leader={`ID: ${item.leader?.id}`}
              initiallyLiked={interestedStudyIds.includes(item.id)}
              url="?tab=intro"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
