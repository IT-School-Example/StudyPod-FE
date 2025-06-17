"use client";
import { useState, useEffect } from "react";

const categoryMap = {
  free: "자유",
};

export default function PostBoard({ onPostSubmit, studyDetail }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "free",
  });
  const [userId, setUserId] = useState(null);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("사용자 정보 조회 실패");

        const data = await res.json();
        setUserId(data.id);
      } catch (err) {
        console.error("유저 정보 가져오기 실패:", err);
        alert("로그인이 필요합니다.");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const body = {
      data: {
        title: form.title,
        content: form.content,
        studyBoardCategory: "FREE", // 서버는 대문자 FREE 요구
        user: { id: userId },
        studyGroup: { id: studyDetail },
      },
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("게시글 등록 실패");

      const response = await res.json();
      alert("게시글이 성공적으로 등록되었습니다.");

      // 등록한 글을 부모에 전달
      onPostSubmit(response.data);

      // 폼 초기화
      setForm({ title: "", content: "", category: "free" });
    } catch (err) {
      console.error(err);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mb-8 space-y-3">
      <div className="flex gap-4">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded px-3 py-2"
        >
          {Object.entries(categoryMap).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="제목"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="flex-1 border rounded px-3 py-2"
        />
      </div>
      <textarea
        placeholder="내용을 입력하세요"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="w-full border rounded px-3 py-2 h-32"
      />
      <button
        onClick={handleSubmit}
        className="bg-[#4B2E1E] text-white px-4 py-2 rounded hover:bg-[#3e2619]"
      >
        작성하기
      </button>
    </div>
  );
}
