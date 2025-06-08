"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function Me() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", name: "", password: "" });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentEmail = localStorage.getItem("currentUser");
    const currentUser = users.find((u) => u.email === currentEmail);
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <div className="flex flex-1">
        {/* 사이드 메뉴 */}
        <aside className="w-64 h-full bg-gray-100 border-r p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">MY 페이지</h2>
          <ul className="space-y-4">
            <li className="hover:text-blue-500 cursor-pointer">나의 정보</li>
            <li className="hover:text-blue-500 cursor-pointer">소속된 스터디 목록</li>
            <li className="hover:text-blue-500 cursor-pointer">관리 스터디 목록</li>
            <li className="hover:text-blue-500 cursor-pointer">신청한 스터디 목록</li>
          </ul>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-10 bg-gray-50 flex items-center justify-center">
          <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
              마이페이지
            </h1>
            <div className="space-y-4 text-gray-700 mb-8">
              <p>
                <span className="font-medium">이름:</span>{" "}
                {user.name || "저장된 이름 없음"}
              </p>
              <p>
                <span className="font-medium">이메일:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">비밀번호:</span> {user.password}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
