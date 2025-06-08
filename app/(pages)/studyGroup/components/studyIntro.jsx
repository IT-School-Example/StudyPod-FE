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
          <p className="leading-relaxed whitespace-pre-line">
            {study.introduce}
          </p>
        </div>
      </div>
    </>
  );
}
