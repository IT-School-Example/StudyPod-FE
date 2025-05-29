"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Enrollment({study}) {
  const [user, setName] = useState("");
  const [introduce, setIntroduce] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === currentEmail);
    if (user) setName(user.name);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const joinMember = {
      id: Date.now(),
      user,
      introduce,
      status : "pending",
      studyDetail: study
    };
    await fetch("/api/joinMember", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(joinMember),
    });
    router.push('/');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 신청 하기</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 max-w-lg"
      >
        <input
          placeholder="소개글 내용"
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          신청 완료
        </button>
      </form>
    </div>
  );
}
