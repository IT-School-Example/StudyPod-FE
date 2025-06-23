"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import StudyCard from "@/components/card/studyCard";
import { subjectOptions, meetingOptions, sidoOptions } from "@/shared/constants";
import { useUser } from "@/context/UserContext";
import { useLikedStudies } from "@/hooks/useLikedStudies";

export default function Search() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [studyTopic, setStudyTopic] = useState("");
  const [studyMethods, setStudyMethods] = useState([]);
  const [isRecruiting, setIsRecruiting] = useState(false);
  const [studyData, setStudyData] = useState([]);
  const { user } = useUser();
  const { likedMap, setLikedMap } = useLikedStudies(user?.id, { fetchDetails: false });

  useEffect(() => {
    fetchFilteredStudies();
  }, [query, region, studyTopic, studyMethods, isRecruiting]);

  const toggleStudyMethod = (method) => {
    setStudyMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const fetchFilteredStudies = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL + "/study-groups";
      const urls = [];

      if (query) urls.push(`${base}/search?keyword=${encodeURIComponent(query)}`);
      if (studyTopic) urls.push(`${base}/filter/subject?subject=${studyTopic}`);
      if (region) {
        const sidoCd = sidoOptions.find((s) => s.sidoNm === region)?.sidoCd;
        if (sidoCd) urls.push(`${base}/filter/sido?sidoCd=${sidoCd}`);
      }
      studyMethods.forEach((method) => {
        urls.push(`${base}/filter/meeting?meeting=${method}`);
      });
      if (isRecruiting) urls.push(`${base}/filter/recruitment?status=RECRUITING`);

      let merged = [];

      if (urls.length === 0) {
        const res = await fetch(base);
        const data = await res.json();
        merged = data.data || [];
      } else {
        const results = await Promise.all(urls.map((url) => fetch(url).then((res) => res.json())));
        merged = results.flatMap((res) => res.data || []);
      }
      const unique = [...new Map(merged.map((item) => [item.id, item])).values()];
      setStudyData(unique);
    } catch (err) {
      console.error("스터디 필터 API 오류:", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 검색</h1>

      {/* 검색창 */}
      <input
        type="text"
        placeholder="스터디 이름, 키워드, 작성자 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded-md px-4 py-2 mb-6 w-full max-w-lg"
      />

      {/* 필터 */}
      <div className="flex flex-wrap gap-6 mb-6 items-center">
        {/* 지역 */}
        <label>
          지역:
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="">전체</option>
            {sidoOptions.map((s) => (
              <option key={s.sidoCd} value={s.sidoNm}>
                {s.sidoNm}
              </option>
            ))}
          </select>
        </label>

        {/* 주제 */}
        <label className="block mb-1">주제:
          <select
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="">-- 선택하세요 --</option>
              {subjectOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))}
          </select>
        </label>

        {/* 스터디 방식 */}
        <div>
          <span className="mr-2 font-semibold">스터디 방식:</span>
          {meetingOptions.map((m) => (
            <label key={m.value} className="mr-4 cursor-pointer">
              <input
                type="checkbox"
                checked={studyMethods.includes(m.value)}
                onChange={() => toggleStudyMethod(m.value)}
                className="mr-1"
              />
              {m.label}
            </label>
          ))}
        </div>

        {/* 모집 여부 */}
        <label className="cursor-pointer ml-6 flex items-center">
          <input
            type="checkbox"
            checked={isRecruiting}
            onChange={() => setIsRecruiting(!isRecruiting)}
            className="mr-1"
          />
          모집 중인 스터디만 보기
        </label>
      </div>

      {/* 결과 */}
      <div className="flex flex-wrap gap-x-6 gap-y-6">
        {studyData.length > 0 ? (
          studyData.map((item) => (
            <StudyCard
              key={item.id}
              detail={item.id}
              tag={item.keywords?.[0]}
              content={item.title}
              leader={item.leader?.id}
              url="?tab=intro"
              initiallyLiked={!!likedMap[item.id]}
              interestedId={likedMap[item.id]}
              setLikedMap={setLikedMap}
            />
          ))
        ) : (
          <p className="text-gray-500">조건에 맞는 스터디가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
