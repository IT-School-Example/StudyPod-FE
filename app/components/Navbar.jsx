"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoPersonOutline, IoExitOutline } from "react-icons/io5";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    // 필요하다면 페이지 리로드나 이동
    // window.location.reload();
    // or router.push('/')
  };

  return (
    <div className="w-full h-20 bg-white flex flex-row justify-between top-0 sticky shadow-2xs z-50">
      <nav className="w-full h-20 bg-white flex flex-row justify-between top-0 sticky">
        <div className="flex flex-row p-2 text-black font-semibold space-x-5">
          <Link href="/">
            <Image
              className="w-12 h-12"
              src="/logo.png"
              width={164}
              height={174}
              alt="logo"
            />
          </Link>
          <div className="flex flex-row py-5 text-black font-semibold space-x-5">
            <Link href="/search">
              <h1>스터디 그룹 조건 검색</h1>
            </Link>
            <Link href="/faq">
              <h1>공지사항&FAQ</h1>
            </Link>
            <Link href="/event">
              <h1>이벤트</h1>
            </Link>
          </div>
        </div>

        <div className="flex flex-row px-10 py-7 text-white space-x-5 text-center items-center">
          {isLoggedIn ? (
            <>
              <Link href="/createGroup">
                <div className="inline-block px-3 h-6 rounded-lg bg-[#4B2E1E]">
                  <h1>스터디 그룹 개설하기</h1>
                </div>
              </Link>
              <Link href="/mypage/info">
                <IoPersonOutline className="text-black mt-1" size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-black mt-1 hover:text-red-600 transition-colors"
                aria-label="로그아웃"
              >
                <IoExitOutline size={20}/>
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <div className="w-20 h-6 rounded-lg bg-[#4B2E1E]">로그인</div>
              </Link>
              <Link href="/signup">
                <div className="w-20 h-6 rounded-lg bg-gray-500">회원가입</div>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
