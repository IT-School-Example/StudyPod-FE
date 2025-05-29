"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Card from "@/app/components/card";
import Image from "next/image";

export default function Home() {
  const [offset, setOffset] = useState({ y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false); //localstorage에 true false잇음
  const [studyData, setStudyData] = useState([]);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);

    fetch("/studyData.json")
      .then((res) => res.json())
      .then((data) => setStudyData(data));
  }, []);

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
      {isLoggedIn ? (
        <>
          <div className="flex flex-col space-y-5 py-10">
            <h1 className="font-bold text-4xl text-black text-start">
              소속 스터디 그룹
            </h1>
            <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
              {studyData.map((item) => (
                <Card
                  key={item.id}
                  detail={item.detail}
                  tag={item.tag}
                  content={item.content}
                  leader={item.member.role_leader}
                  like={item.like}
                  url={`?tab=members`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-5 py-10">
            <h1 className="font-bold text-4xl text-black text-start">
              추천 스터디 그룹
            </h1>
            <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
              {studyData.map((item) => (
                <Card
                  key={item.id}
                  detail={item.detail}
                  tag={item.tag}
                  content={item.content}
                  leader={item.member.role_leader}
                  like={item.like}
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
              <Card
                detail={item.detail}
                key={item.id}
                tag={item.tag}
                content={item.content}
                leader={item.member.role_leader}
                like={item.like}
                url={`?tab=intro`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
