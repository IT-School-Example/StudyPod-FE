"use client";

import Navbar from "@/components/common/Navbar";
import { IoHammerOutline } from "react-icons/io5";

export default function Event() {
  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <IoHammerOutline size={48} className="text-gray-500" />
        <h1 className="text-2xl font-semibold">이벤트 페이지는 현재 개발 중입니다!</h1>
        <p className="text-gray-500">조금만 기다려 주세요 😊</p>
      </div>
    </div>
  );
}
