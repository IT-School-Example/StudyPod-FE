"use client";
import Link from "next/link";

export default function StudyIntro({ study }) {
  return (
    <>
      <div className="p-10 space-y-8 text-black">
        <div className="space-x-2">
          <span className="bg-[#FBEDD7] text-sm px-3 py-1 rounded-full">
            {study.tag}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {study.content}
          </h1>
          <Link href={`/studyGroup/${study.detail}?tab=enrollment`}>
            <button className="py-3 px-6 rounded-md bg-[#4B2E1E] text-white font-semibold">
              스터디 신청하기
            </button>
          </Link>
        </div>


        <div className="grid grid-cols-2 gap-y-3 w-64">
          <div>일정</div>
          <div className="font-semibold">{study.schedule}</div>
          <div>장소</div>
          <div className="font-semibold">{study.place}</div>
          <div>인원</div>
          <div className="font-semibold">{study.maxMember}</div>
          <div>참가비</div>
          <div className="font-semibold">{study.fee}</div>
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
      </div>
    </>
  );
}
