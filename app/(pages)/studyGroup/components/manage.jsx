"use client";

import { useState, useEffect } from "react";
import Board from "./(manage)/board";
import Member from "./(manage)/member";
import Notice from "./(manage)/notice";
import Introduce from "./(manage)/introduce";
import Request from "./(manage)/request";
import Info from "./(manage)/info";

export default function Manage({ study }) {
  const [userId, setUserId] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [tab, setTab] = useState("info");

  const tabs = [
    { key: "info", label: "스터디 정보 관리" },
    { key: "member", label: "회원 관리" },
    { key: "request", label: "스터디 그룹 신청자 관리" },
    { key: "board", label: "게시글 관리" },
    { key: "notice", label: "공지사항 작성" },
    { key: "introduce", label: "소개(모집)글 작성 및 관리" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("유저 정보 조회 실패");
        const user = await res.json();
        setUserId(user.id);

        // 리더 권한 확인
        const isLeaderUser = study.leader?.id === user.id;
        setIsLeader(isLeaderUser);
      } catch (err) {
        console.error("사용자 인증 오류:", err);
        setIsLeader(false);
      }
    };

    fetchUser();
  }, [study]);

  if (!isLeader) {
    return <p className="text-red-500">리더만 접근할 수 있습니다.</p>;
  }

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {tabs.map(({ key, label }) => {
          const isActive = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                isActive
                  ? "bg-[#4B2E1E] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-[#4B2E1E4D] hover:text-[#4B2E1E]"
              } focus:outline-none focus:ring-2 focus:ring-[#4B2E1E80]`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "info" && <Info study={study} />}
      {tab === "member" && <Member study={study} />}
      {tab === "request" && <Request study={study} />}
      {tab === "board" && <Board study={study} />}
      {tab === "notice" && <Notice study={study} />}
      {tab === "introduce" && <Introduce study={study} />}
    </div>
  );
}
