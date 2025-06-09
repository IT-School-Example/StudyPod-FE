"use client";

import { FaUser, FaUserTie } from "react-icons/fa6";

export default function StudySideCard({ tag, detail, isLeader }) {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white hover:border-blue-300 transition w-full max-w-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm bg-[#FBEDD7] px-3 py-1 rounded-xl font-medium">
          {tag}
        </span>
        <span className="flex items-center text-sm text-gray-600 gap-1">
          {isLeader ? <FaUserTie /> : <FaUser />}
          {isLeader ? "관리자" : "참여자"}
        </span>
      </div>
      <p className="text-gray-700 text-sm">{detail}</p>
    </div>
  );
}
