"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", name: "", password: "" });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
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
    <>
      <Navbar />
      <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-4 px-24">
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
      </div>
    </>
  );
}
