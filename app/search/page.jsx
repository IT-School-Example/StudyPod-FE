"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import StudyCard from "@/components/card/studyCard";
import { subjectOptions, meetingOptions, sidoOptions } from "@/shared/constants";
import { getSubjectNm } from "@/shared/utils";
import { useUser } from "@/context/UserContext";
import { useLikedStudies } from "@/hooks/useLikedStudies";
import { IoSearch } from "react-icons/io5";

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
  }, [region, studyTopic, studyMethods, isRecruiting]);

  const toggleStudyMethod = (method) => {
    setStudyMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const fetchFilteredStudies = async () => {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL + "/study-groups";

    // ✅ 검색어 있을 경우 POST로 별도 처리
      if (query) {
        const res = await fetch(`${base}/search?searchStr=${encodeURIComponent(query)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              meetingMethod: studyMethods.length > 0 ? studyMethods[0] : null, // 하나만 선택 가능하도록 가정
              recruitmentStatus: isRecruiting ? "RECRUITING" : null,
              subjectArea: studyTopic ? { id: Number(studyTopic) } : null,
            },
          }),
        });
        const data = await res.json();
        setStudyData(data.data || []);
        return;
      }

      const urls = [];

      if (studyTopic) urls.push(`${base}/filter/subject?value=${studyTopic}`);
      if (region) {
        const sidoCd = sidoOptions.find((s) => s.sidoNm === region)?.sidoCd;
        if (sidoCd) urls.push(`${base}/filter/sido?sidoCd=${sidoCd}`);
      }
      studyMethods.forEach((method) => {
        urls.push(`${base}/filter/meeting?meetingMethod=${method}`);
      });
      if (isRecruiting) urls.push(`${base}/filter/recruitment?recruitmentStatus=RECRUITING`);

      let merged = [];

      if (urls.length === 0) {
        const res = await fetch(base, { credentials: "include" });
        const data = await res.json();
        merged = data.data || [];
      } else {
        const results = await Promise.all(
          urls.map((url) => fetch(url, { credentials: "include" }).then((res) => res.json()))
        );
        merged = results.flatMap((res) => res.data || []);
      }

      const unique = [...new Map(merged.map((item) => [item.id, item])).values()];
      setStudyData(unique);
    } catch (err) {
      console.error("스터디 필터 API 오류:", err);
    }
  };


  const handleSearch = () => {
    fetchFilteredStudies();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 검색</h1>

      {/* 검색창 */}
      <div className="relative max-w-lg w-full mb-6">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border rounded-md px-4 py-2 mb-6 w-full max-w-lg pr-10"
        />

        {/* 오른쪽 돋보기 아이콘 */}
        <button
          onClick={handleSearch}
          className="absolute top-[14px] right-3 text-gray-500 hover:text-gray-700"
        >
          <IoSearch size={20} />
        </button>
      </div>

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
                <option key={option.value} value={option.value}>
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
              tag={getSubjectNm(item.subjectArea?.id)}
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
