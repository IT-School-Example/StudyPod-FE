"use client";

import { useState, useEffect } from "react";
import ViewBoard from "@/app/components/board/viewBoard";
import PostBoard from "@/app/components/board/postBoard";
import { useUser } from "@/app/context/UserContext";

export default function StudyMembers({ study }) {
  const { user } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [tab, setTab] = useState("info");
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!user || !study) return;

    const isLeader = study.leader?.id === user.id;
    const isMember = study.members?.some((m) => m.id === user.id);
    setIsAuthorized(isLeader || isMember);
  }, [user, study]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (tab === "info") return;

      const endpoint =
        tab === "notice"
          ? `/study-boards/study-groups/${study.id}/notices`
          : `/study-boards/study-groups/${study.id}/frees`;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("게시글 조회 실패");
        const result = await res.json();
        setPosts(result.data);
      } catch (err) {
        console.error("게시글 조회 오류:", err);
      }
    };

    fetchPosts();
  }, [study.id, tab]);


  const tabs = [
    { key: "info", label: "스터디 정보" },
    { key: "notice", label: "공지사항" },
    { key: "free", label: "자유게시판" },
  ];

  const handleShowPost = (category) => {
    setSelectedCategory(category);
    setShowPostForm(true);
  };

  const handleBackToList = () => {
    setShowPostForm(false);
    setSelectedPost(null);
  };

  const handleTabChange = (key) => {
    setTab(key);
    setShowPostForm(false);
    setSelectedPost(null);
  };

  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowPostForm(false);
  };

  if (!isAuthorized) {
    return <p className="text-red-500">접근 권한이 없습니다.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📚 스터디 그룹</h2>

      <div className="flex gap-4 mb-6">
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

      {tab === "info" && (
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <p><strong>태그:</strong> {study.keywords}</p>
          <p><strong>제목:</strong> {study.title}</p>
          <p>
            <strong>일정:</strong>{" "}
            {study.weeklySchedules
              .map(
                (w) =>
                  `${w.dayOfWeek} ${w.startTime} ~ ${w.endTime} (${w.periodMinutes}분)`
              )
              .join(", ")}
          </p>
          <p><strong>지역:</strong> {study.address?.sido?.sidoNm}</p>
          <p><strong>정원:</strong> {study.maxMembers}</p>
          <p><strong>참가비:</strong> {study.amount ? `${study.amount.toLocaleString()}원` : "무료"}</p>
        </div>
      )}

      {tab === "notice" && (
        <div className="bg-white p-4 rounded">
          {showPostForm ? (
            <PostBoard
              category={selectedCategory}
              onBack={handleBackToList}
              studyDetail={study.id}
              onPostSubmit={handleAddPost}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">📢 공지사항</h3>
              </div>
              <ViewBoard
                posts={posts.filter((p) => p.studyBoardCategory === "NOTICE")}
                setPosts={setPosts}
              />
            </>
          )}
        </div>
      )}

      {tab === "free" && (
        <div className="bg-white p-4 rounded">
          {showPostForm ? (
            <PostBoard
              category={selectedCategory}
              onBack={handleBackToList}
              studyDetail={study.id}
              onPostSubmit={handleAddPost}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">💬 자유게시판</h3>
                <button
                  onClick={() => handleShowPost("FREE")}
                  className="px-3 py-1 bg-[#4B2E1E] text-white text-sm rounded hover:bg-[#3a2117]"
                >
                  글 작성하기
                </button>
              </div>
              <ViewBoard
                posts={posts.filter((p) => p.studyBoardCategory === "FREE")}
                setPosts={setPosts}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
