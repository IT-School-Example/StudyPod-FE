"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function CreateGroup() {
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [leader, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [place, setPlace] = useState("");
  const [maxMember, setMaxMember] = useState("");
  const [fee, setFee] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === currentEmail);
    if (user) setName(user.name);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  const detail = crypto.randomUUID();

  const newStudy = {
    id: Date.now(),
    tag,
    content,
    detail,
    schedule,
    place,
    maxMember,
    fee,
    like: 0,
    introduce: "",
    member: {
      role_leader: leader,
      role_member: []
    }
  };

  await fetch("/api/newStudy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudy),
  });

  router.push(`/studyGroup/${detail}?tab=manage`);
};

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 개설 페이지</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 max-w-lg"
      >
        <input
          placeholder="태그"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <input
          placeholder="제목 (content)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <input
          placeholder="일정"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <input
          placeholder="장소"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <input
          placeholder="인원"
          value={maxMember}
          onChange={(e) => setMaxMember(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <input
          placeholder="참가비"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          생성하기
        </button>
      </form>
    </div>
  );
}
