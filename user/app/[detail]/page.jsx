"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function StudyDetail({ params }) {
  const [study, setStudy] = useState(null);

  useEffect(() => {
    fetch("/studyData.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const matched = data.find((item) => item.detail === params.detail);
        //console.log(params.detail);
        //console.log(matched);
        setStudy(matched);
      })
      .catch((err) => {
        console.error("Error fetching studyData.json", err);
      });
  }, [params.detail]);

  if (study === null) return <p>로딩 중</p>;
  if (!study) return <p>스터디를 찾을 수 없습니다</p>;

  return (
    <>
      <div className="w-full h-full flex flex-col bg-white px-24">
        <Navbar />
        <div className="p-10 space-y-8 text-black">
          <div className="space-x-2">
            <span className="bg-[#FBEDD7] text-sm px-3 py-1 rounded-full">
              {study.tag}
            </span>
          </div>

          <h1 className="text-3xl font-bold">{study.content}</h1>

          <div className="grid grid-cols-2 gap-y-3 w-64">
            <div>일정</div>
            <div className="font-semibold">매주 월요일</div>
            <div>장소</div>
            <div className="font-semibold">온라인(줌)</div>
            <div>인원</div>
            <div className="font-semibold">4명</div>
            <div>참가비</div>
            <div className="font-semibold">1만원</div>
          </div>

          <div>
            <h2 className="text-xl font-bold mt-10 mb-2">스터디 그룹 소개</h2>
            <hr className="mb-4" />
            <p className="leading-relaxed">
              프로그래밍 언어 중에 가장 간단한 파이썬 같이 공부하실 초심자 분들을
              모집합니다!!
              <br />
              저희는 OO 교재 사용할 예정이고, 입출력문부터 천천히 시작할 거예요!
              <br />
              혼자 하기 부담되셨던 분들, 처음 접하는 분들 모두 환영입니다!
              <br />
              기초부터 같이 차근차근 공부해봐요
              <br />
              관심 있으신 분들은 편하게 신청해주세요!
            </p>
          </div>

          <div>
            <Link href="/enrollment">
              <button className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold mb-6">
              로그인
            </button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
