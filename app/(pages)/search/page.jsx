"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import StudyCard from "@/app/components/card/studyCard";

const subjectOptions = [
  { id: 1, value: "LANGUAGE" },
  { id: 2, value: "IT" },
  { id: 3, value: "EXAM" },
  { id: 4, value: "JOB" },
  { id: 5, value: "SCHOOL" },
  { id: 6, value: "HOBBY" },
  { id: 7, value: "CULTURE" },
  { id: 8, value: "SCIENCE" },
  { id: 9, value: "HUMANITIES" },
  { id: 10, value: "BUSINESS" },
  { id: 11, value: "ETC" }
];

const meetingOptions = [
  { value: "ONLINE", label: "온라인" },
  { value: "OFFLINE", label: "오프라인" },
  { value: "BOTH", label: "혼합" },
];

const sidoOptions = [
  { sidoCd: "11", sidoNm: "서울특별시" },
  { sidoCd: "26", sidoNm: "부산광역시" },
  { sidoCd: "27", sidoNm: "대구광역시" },
  { sidoCd: "28", sidoNm: "인천광역시" },
  { sidoCd: "29", sidoNm: "광주광역시" },
  { sidoCd: "30", sidoNm: "대전광역시" },
  { sidoCd: "31", sidoNm: "울산광역시" },
  { sidoCd: "36", sidoNm: "세종특별자치시" },
  { sidoCd: "41", sidoNm: "경기도" },
  { sidoCd: "43", sidoNm: "충청북도" },
  { sidoCd: "44", sidoNm: "충청남도" },
  { sidoCd: "46", sidoNm: "전라남도" },
  { sidoCd: "47", sidoNm: "경상북도" },
  { sidoCd: "48", sidoNm: "경상남도" },
  { sidoCd: "50", sidoNm: "제주특별자치도" },
  { sidoCd: "51", sidoNm: "강원특별자치도" },
  { sidoCd: "52", sidoNm: "전북특별자치도" },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [studyTopic, setStudyTopic] = useState("");
  const [studyMethods, setStudyMethods] = useState([]);
  const [isRecruiting, setIsRecruiting] = useState(false);
  const [studyData, setStudyData] = useState([]);

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
              tag={item.keywords?.[0] || "스터디"}
              content={item.title}
              leader={item.leader?.id}
              like={item.likeCount || 0}
              url={`?tab=intro`}
            />
          ))
        ) : (
          <p className="text-gray-500">조건에 맞는 스터디가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
