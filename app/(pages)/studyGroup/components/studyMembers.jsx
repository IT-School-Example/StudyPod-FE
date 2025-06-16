"use client";

import { useState, useEffect } from "react";
import ViewBoard from "@/app/components/viewBoard";
import PostBoard from "@/app/components/postBoard";

export default function StudyMembers({ study }) {
  const [userId, setUserId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [tab, setTab] = useState("info");
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("인증된 사용자 정보 불러오기 실패");
        const data = await res.json();
        setUserId(data.id);

        // 권한 확인
        const isLeader = study.leader?.id === data.id;
        const isMember = study.members?.some((m) => m.id === data.id);
        setIsAuthorized(isLeader || isMember);
      } catch (err) {
        console.error("인증 오류:", err);
        setIsAuthorized(false);
      }
    };

    fetchUser();
  }, [study]);

  useEffect(() => {
    fetch("/studyBoardData.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (post) => post.study_group_detail === study.detail
        );
        setPosts(filtered);
      });
  }, [study.detail]);

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

  if (!isAuthorized) {
    return <p className="text-red-500">접근 권한이 없습니다.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📚 스터디 그룹</h2>

      {/* 탭 버튼 */}
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

      {/* 탭 콘텐츠 */}
      {tab === "info" && (
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <p><strong>태그:</strong> {study.tag}</p>
          <p><strong>제목:</strong> {study.content}</p>
          <p><strong>일정:</strong> {study.schedule}</p>
          <p><strong>장소:</strong> {study.place}</p>
          <p><strong>정원:</strong> {study.maxMember}</p>
          <p><strong>참가비:</strong> {study.fee}</p>
        </div>
      )}

      {tab === "notice" && (
        <div className="bg-white p-4 rounded">
          {showPostForm ? (
            <PostBoard
              category={selectedCategory}
              onBack={handleBackToList}
              study={study}
              setPosts={setPosts}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">📢 공지사항</h3>
              </div>
              <ViewBoard
                posts={posts.filter((p) => p.category === tab)}
                setPosts={setPosts}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
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
              study={study}
              setPosts={setPosts}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">💬 자유게시판</h3>
                <button
                  onClick={() => handleShowPost(tab)}
                  className="px-3 py-1 bg-[#4B2E1E] text-white text-sm rounded hover:bg-[#3a2117]"
                >
                  글 작성하기
                </button>
              </div>
              <ViewBoard
                posts={posts.filter((p) => p.category === tab)}
                setPosts={setPosts}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
