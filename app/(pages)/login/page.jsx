"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, SetIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        data:{ email, password }
      }),
    });

    if (response.ok) {
      // const text = await response.text();
      // console.log("응답 내용:", text);

      SetIsLoggedIn(true);
      router.push("/");
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="w-full h-screen flex items-center justify-center bg-[#faeed5]">
        <Image
          className="w-64 h-64"
          src="/logobg.png"
          width="1024"
          height="1024"
          alt="bg"
        />
      </div>
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          <h1 className="text-2xl font-bold text-center mb-10 text-black">
            로그인
          </h1>

          <div className="mb-6">
            <label className="block text-sm text-gray-500 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-500 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold mb-6"
          >
            로그인
          </button>
          <div className="flex gap-2 justify-center text-center">
            <Link
              href="/findPW"
              className="flex-1 py-2 rounded-md bg-gray-100 text-black font-medium"
            >
              <h1>비밀번호 찾기</h1>
            </Link>
            <Link
              href="/signup"
              className="flex-1 py-2 rounded-md bg-gray-100 text-black font-medium"
            >
              <h1>회원가입</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
