"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Card from "@/app/components/card";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [studyData, setStudyData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("/studyData.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setStudyData(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    const lower = query.toLowerCase();
    setFiltered(
      studyData.filter(
        (item) =>
          item.tag.toLowerCase().includes(lower) ||
          item.content.toLowerCase().includes(lower) ||
          item.name.toLowerCase().includes(lower)
      )
    );
  }, [query, studyData]);

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 검색</h1>
      <input
        type="text"
        placeholder="스터디 이름, 키워드, 작성자 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded-md px-4 py-2 mb-6 w-full max-w-lg"
      />
      <div className="flex flex-wrap gap-x-6 gap-y-6">
        {filtered.map((item) => (
          <Card
            key={item.id}
            tag={item.tag}
            content={item.content}
            name={item.name}
            like={item.like}
            detail={item.detail}
          />
        ))}
      </div>
    </div>
  );
}
