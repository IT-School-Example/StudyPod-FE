"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Enrollment({ study }) {
  const { user } = useUser();
  const [introduce, setIntroduce] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
    }
  }, [user, router]);

  if (!study) {
    return <p className="text-red-500">스터디 정보를 불러오는 중입니다...</p>;
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      introduce,
      status: "PENDING",
      studyGroup: { id: study.id },
      user: { id: user.id },
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ data: payload }),
      });

      if (!res.ok) throw new Error("신청 실패");
      alert("스터디 신청이 완료되었습니다.");
      router.push("/");
    } catch (err) {
      console.error("신청 오류:", err);
      alert("신청 중 문제가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 신청 하기</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-lg">
        <input
          placeholder="소개글 내용"
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
          className="border rounded-md px-4 py-2"
          required
        />
        <button type="submit" className="bg-[#4B2E1E] text-white px-4 py-2 rounded-md">
          신청 완료
        </button>
      </form>
    </div>
  );
}
