"use client";

import { useState } from "react";
import { useUser } from "@/app/context/UserContext";

const categoryMap = {
  free: "자유",
};

export default function PostBoard({ onPostSubmit, studyDetail }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "free",
  });

  const { user } = useUser();
  const userId = user?.id;

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
        studyBoardCategory: "FREE", 
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

      onPostSubmit(response.data);

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
