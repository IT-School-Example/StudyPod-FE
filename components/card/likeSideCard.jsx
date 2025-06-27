"use client";

import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import UserName from "@/components/common/UserName";

/**
 * 마이페이지 > 관심 스터디 카드
 * @param {string} tag - 스터디 키워드 중 첫 번째
 * @param {string} content - 스터디 제목
 * @param {number|string} leader - 리더 유저 ID
 * @param {number} detail - 스터디 ID
 * @param {string} url - 상세 페이지로 이동할 때 붙일 URL 쿼리
 */
export default function LikeSideCard({ tag, content, leader, detail, url }) {
  return (
    <Link href={`/studyGroup/${detail}${url ?? ""}`}>
      <div className="p-4 w-full border-2 border-black rounded-xl hover:border-blue-300 hover:scale-105 transition">
        <div className="mb-3">
          <div className="inline-block px-3 py-1 text-sm bg-[#FBEDD7] rounded-xl mb-2">
            {tag}
          </div>
          <h2 className="font-bold text-lg text-black">{content}</h2>
        </div>
        <div className="border-t border-gray-300 pt-2 flex justify-between items-center text-sm text-black">
          <UserName userId={leader} />
          <span className="flex items-center gap-1">
            <FaHeart className="text-red-500" />
          </span>
        </div>
      </div>
    </Link>
  );
}
