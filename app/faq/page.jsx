"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ViewBoard from "@/components/board/viewBoard";

export default function Faq() {
  const [tab, setTab] = useState("notice");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const tabs = [
    { key: "notice", label: "공지사항" },
    { key: "faq", label: "FAQ" },
  ];

  useEffect(() => {
    fetch("/adminBoardData.json")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

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
            {tab === "notice" ? "📢 공지사항" : "❓ FAQ"}
          </h3>
        </div>
        <ViewBoard
          posts={posts.filter((p) => p.category === tab)}
          setPosts={setPosts}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
      </div>
    </div>
  );
}