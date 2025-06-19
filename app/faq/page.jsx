"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ViewBoard from "@/components/board/viewBoard";

export default function Faq() {
  const [tab, setTab] = useState("NOTICE");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: "NOTICE", label: "공지사항" },
    { key: "FAQ", label: "FAQ" },
  ];

  const fetchBoardData = async (category) => {
    setLoading(true);
    try {
      const endpoint =
        category === "NOTICE"
          ? "/admin-boards/notices"
          : "/admin-boards/faqs";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const result = await res.json();

      if (result.resultCode !== "OK") {
        throw new Error("API 오류: " + result.description);
      }

      setPosts(result.data || []);
    } catch (err) {
      console.error("게시글 불러오기 에러:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData(tab);
  }, [tab]);

  const handleTabChange = (key) => {
    setTab(key);
    setSelectedPost(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />

      <div className="flex gap-4 mb-6 mt-6">
        {tabs.map(({ key, label }) => {
          const isActive = tab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                isActive
                  ? "bg-[#4B2E1E] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-[#4B2E1E4D] hover:text-[#4B2E1E]"
              } focus:outline-none focus:ring-2 focus:ring-[#4B2E1E80]`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {tab === "NOTICE" ? "📢 공지사항" : "❓ FAQ"}
          </h3>
        </div>

        {loading ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : (
          <ViewBoard
            posts={posts}
            setPosts={setPosts}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
          />
        )}
      </div>
    </div>
  );
}
