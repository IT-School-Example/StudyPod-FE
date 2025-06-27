"use client";

import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MypageLayout({ children }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/mypage/info", label: "나의 정보" },
    { href: "/mypage/belong", label: "소속된 스터디 목록" },
    { href: "/mypage/manage", label: "관리 스터디 목록" },
    { href: "/mypage/applied", label: "신청한 스터디 목록" },
    { href: "/mypage/like", label: "좋아요 누른 스터디 목록" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white px-24">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 rounded-xl shadow-md p-6 m-6">
          <h2 className="text-xl font-semibold mb-6">MY 페이지</h2>
          <ul className="space-y-3">
            {tabs.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>
                  <div
                    className={`cursor-pointer block px-4 py-2 rounded-md transition-all duration-200 border ${
                      pathname === href
                        ? "bg-white text-blue-600 font-semibold shadow-sm border-blue-200"
                        : "text-gray-700 hover:bg-gray-200 border-transparent"
                    }`}
                  >
                    {label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-10 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
