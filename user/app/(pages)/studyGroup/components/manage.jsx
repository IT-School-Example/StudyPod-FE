"use client";

import { useState } from "react";
import Board from "./(manage)/board";
import Member from "./(manage)/member";
import Notice from "./(manage)/notice";
import Introduce from "./(manage)/introduce";
import Request from "./(manage)/request";

export default function Manage({ study }) {
  const [tab, setTab] = useState("member"); // 초기 탭을 member로 변경

  const tabs = [
    { key: "member", label: "회원 관리" },
    { key: "notice", label: "공지사항 작성" },
    { key: "board", label: "게시글 관리" },
    { key: "introduce", label: "소개(모집)글 작성" },
    { key: "request", label: "스터디 그룹 신청자 관리" },
  ];

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {tabs.map(({ key, label }) => {
          const isActive = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`
                px-4 py-2 rounded-md font-semibold transition
                ${
                  isActive
                    ? "bg-[#4B2E1E] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-[#4B2E1E4D] hover:text-[#4B2E1E]"
                }
                focus:outline-none focus:ring-2 focus:ring-[#4B2E1E80]
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "board" && <Board study={study} />}
      {tab === "member" && <Member study={study} />}
      {tab === "notice" && <Notice study={study} />}
      {tab === "introduce" && <Introduce study={study} />}
      {tab === "request" && <Request study={study} />}
    </div>
  );
}
