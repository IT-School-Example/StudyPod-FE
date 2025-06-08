import { useState, useEffect } from "react";

export default function Notice({ study }) {
  const [name, setName] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
  });


  useEffect(() => {
      const currentEmail = localStorage.getItem("currentUser");
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email === currentEmail);
      if (user) setName(user.name);
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      category: "notice", // 고정
      title: form.title,
      content: form.content,
      study_group_detail: study.detail,
      user_id: name,
    };

    try {
      const res = await fetch("/api/postBoard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error("게시글 저장 실패");

      alert("게시글이 성공적으로 저장되었습니다!");
      setForm({ title: "", content: "" });
    } catch (err) {
      console.error(err);
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
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
