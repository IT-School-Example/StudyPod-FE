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
  const [name, setName] = useState("");

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);

    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === currentEmail);
    if (user) setName(user.name);
    
    const fetchStudyGroups = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log(process.env.NEXT_PUBLIC_API_URL);
        const res = await fetch(`${apiUrl}/api/study-groups`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
          },
          credentials: 'include'
        }); 
        if (!res.ok) throw new Error("1. Failed to fetch study groups");
        const data = await res.json();
        if (!data) console.log(2-1);
        console.log(2-2, data);
        setStudyData(data.data || []);
      } catch (error) {
        console.error("3. Error fetching study groups:", error);
      }
    }

    fetchStudyGroups();
  }, []);

  const handleMouseMove = (e) => {
    const { top, height } = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - top) / height - 0.5) * 20;
    setOffset({ y });
  };

  // 그룹 필터링 (리더, 소속, 추천 그룹)
  const leaderGroups = studyData.filter((item) =>
    item.member?.role_leader?.includes(name)
  );
  const memberGroups = studyData.filter(
    (item) =>
      item.member?.role_member?.includes(name) ||
      item.member?.role_leader?.includes(name)
  );
  const recommendedGroups = studyData.filter(
    (item) =>
      !item.member?.role_member?.includes(name) &&
      !item.member?.role_leader?.includes(name)
  );
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

      {isLoggedIn ? (
        <>
          {leaderGroups?.length > 0 && (
            <div className="flex flex-col space-y-5 py-10">
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl text-black">관리 스터디</h1>
                <Link href="/mypage/manage">
                  <span className="text-sm text-gray-500 ml-2">전체 보기</span>
                </Link>
              </div>
              <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
                {leaderGroups.map((item) => (
                  <StudyCard
                    key={item.id}
                    detail={item.id}
                    tag={item.keywords[1]}
                    content={item.title}  // 간단한 설명
                    leader={item.leader}
                    like={4}
                    url={`?tab=manage`}  // 관리 그룹으로 이동
                  />
                ))}
              </div>
            </div>
          )}

          {memberGroups?.length > 0 && (
            <div className="flex flex-col space-y-5 py-10">
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl text-black">소속 스터디</h1>
                <Link href="/mypage/belong">
                  <span className="text-sm text-gray-500 ml-2">전체 보기</span>
                </Link>
              </div>
              <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
                {memberGroups.map((item) => (
                  <StudyCard
                    key={item.id}
                    detail={item.id}
                    tag={item.keywords[1]}
                    content={item.title}
                    leader={item.leader}
                    like={4}
                    url={`?tab=members`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-5 py-10">
            <h1 className="font-bold text-4xl text-black text-start">
              추천 스터디 그룹
            </h1>
            <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
              {recommendedGroups.map((item) => (
                <StudyCard
                  key={item.id}
                  detail={item.id}
                  tag={item.keywords[1]}
                  content={item.title}
                  leader={item.leader}
                  like={4}
                  url={`?tab=intro`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col space-y-5 py-10">
          <h1 className="font-bold text-4xl text-black text-start">
            추천 스터디 그룹
          </h1>
          <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
            {studyData.map((item) => (
              <StudyCard
                key={item.id}
                detail={item.id}
                tag={item.keywords[1]}
                content={item.title}
                leader={item.leader}
                like={4}
                url={`?tab=intro`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
