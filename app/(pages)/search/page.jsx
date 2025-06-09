"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import StudyCard from "@/app/components/card/studyCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [studyData, setStudyData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // 기존 select 상태
  const [region, setRegion] = useState("");
  const [studyTopic, setStudyTopic] = useState("");

  // 새로 추가된 체크박스 상태
  const [studyMethods, setStudyMethods] = useState([]); // 온라인, 오프라인 여러개 선택 가능
  const [isRecruiting, setIsRecruiting] = useState(false); // 모집 여부

  useEffect(() => {
    fetch("/studyData.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setStudyData(data);
        setFiltered(data);
      });
  }, []);

  // studyMethods 체크박스 토글 함수
  const toggleStudyMethod = (method) => {
    if (studyMethods.includes(method)) {
      setStudyMethods(studyMethods.filter((m) => m !== method));
    } else {
      setStudyMethods([...studyMethods, method]);
    }
  };

  useEffect(() => {
    const lower = query.toLowerCase();

    setFiltered(
      studyData.filter((item) => {
        // 텍스트 검색
        const matchesQuery =
          item.tag.toLowerCase().includes(lower) ||
          item.content.toLowerCase().includes(lower) ||
          item.member.role_leader.toLowerCase().includes(lower);

        // 지역 필터
        const matchesRegion = region ? item.region === region : true;

        // 주제 필터
        const matchesTopic = studyTopic ? item.topic === studyTopic : true;

        // 스터디 방식 필터 (선택 없으면 모두 허용)
        // item.study_method가 "온라인" 또는 "오프라인" 등 문자열이라고 가정
        const matchesMethod =
          studyMethods.length === 0 || studyMethods.includes(item.study_method);

        // 모집 여부 필터 (false면 무시, true면 모집중인 것만)
        // item.is_recruiting가 boolean이라고 가정
        const matchesRecruiting = !isRecruiting || item.is_recruiting === true;

        return (
          matchesQuery &&
          matchesRegion &&
          matchesTopic &&
          matchesMethod &&
          matchesRecruiting
        );
      })
    );
  }, [query, studyData, region, studyTopic, studyMethods, isRecruiting]);

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 검색</h1>

      {/* 검색 input */}
      <input
        type="text"
        placeholder="스터디 이름, 키워드, 작성자 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded-md px-4 py-2 mb-6 w-full max-w-lg"
      />

      {/* 조건 필터 영역 */}
      <div className="flex flex-wrap gap-6 mb-6 items-center">
        {/* 지역 select */}
        <label>
          지역:
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="">전체</option>
            <option value="서울">서울</option>
            <option value="대전">대전</option>
            <option value="부산">부산</option>
          </select>
        </label>

        {/* 주제 select */}
        <label>
          스터디 주제:
          <select
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="">전체</option>
            <option value="프로그래밍">프로그래밍</option>
            <option value="디자인">디자인</option>
            <option value="마케팅">마케팅</option>
          </select>
        </label>

        {/* 스터디 방식 체크박스 */}
        <div>
          <span className="mr-2 font-semibold">스터디 방식:</span>
          <label className="mr-4 cursor-pointer">
            <input
              type="checkbox"
              checked={studyMethods.includes("온라인")}
              onChange={() => toggleStudyMethod("온라인")}
              className="mr-1"
            />
            온라인
          </label>
          <label className="cursor-pointer">
            <input
              type="checkbox"
              checked={studyMethods.includes("오프라인")}
              onChange={() => toggleStudyMethod("오프라인")}
              className="mr-1"
            />
            오프라인
          </label>
        </div>

        {/* 모집 여부 체크박스 */}
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

      {/* 결과 리스트 */}
      <div className="flex flex-wrap gap-x-6 gap-y-6">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <StudyCard
              key={item.id}
              tag={item.tag}
              content={item.content}
              leader={item.member.role_leader}
              like={item.like}
              detail={item.detail}
            />
          ))
        ) : (
          <p>조건에 맞는 스터디가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
