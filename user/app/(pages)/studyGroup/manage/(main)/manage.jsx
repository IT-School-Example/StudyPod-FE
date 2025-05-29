"use client";

import { useSearchParams } from 'next/navigation';
import Navbar from "@/app/components/Navbar";
import Link from 'next/link';

export default function Manage() {
  const searchParams = useSearchParams();
  const studyId = searchParams.get('studyId');

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <h1>스터디 그룹 리더가 스터디를 관리하는 페이지입니다</h1>
      <p>스터디 ID: {studyId}</p>
      <div>
        <Link href="/">
          <button className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold mb-6">
            홈으로
          </button>
        </Link>
      </div>
    </div>
  );
}
