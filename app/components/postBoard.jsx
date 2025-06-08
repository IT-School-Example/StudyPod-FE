"use client";
import { useState } from "react";

const categoryMap = {
  free: "자유",
};

export default function PostBoard({ onPostSubmit, studyDetail }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "free",
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    const newPost = {
      board_id: Date.now(),
      category: form.category,
      title: form.title,
      content: form.content,
      study_group_detail: studyDetail,
      user_id: localStorage.getItem("currentUser") || "anonymous",
      views: 0,
      date: new Date().toISOString().slice(0, 10),
      comments: [],
    };

    onPostSubmit(newPost);
    setForm({ title: "", content: "", category: "free" });
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