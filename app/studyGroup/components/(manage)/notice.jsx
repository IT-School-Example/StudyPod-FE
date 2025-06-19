"use client";

import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";

export default function Notice({ study }) {
  const { user } = useUser();
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    const newPost = {
      data: {
        title: form.title,
        content: form.content,
        studyBoardCategory: "NOTICE",
        user: { id: user.id },
        studyGroup: { id: study.id },
      },
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error("게시글 저장 실패");

      alert("게시글이 성공적으로 저장되었습니다!");
      setForm({ title: "", content: "" });
    } catch (err) {
      console.error("게시글 저장 중 오류:", err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">공지 작성 페이지입니다!</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">제목</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded h-40"
            placeholder="내용을 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#4B2E1E] text-white px-6 py-3 rounded font-semibold"
          disabled={!user.id}
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
