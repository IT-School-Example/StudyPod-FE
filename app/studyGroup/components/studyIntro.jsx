"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSidoName } from "@/shared/utils";

export default function StudyIntro({ study }) {
  const [introduce, setIntroduce] = useState("");

  useEffect(() => {
    const fetchIntroduce = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-groups/introduce/${study.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setIntroduce(data.data?.content || "소개글이 없습니다.");
      } catch (err) {
        console.error("소개글 불러오기 실패:", err);
        setIntroduce("소개글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    if (study?.id) {
      fetchIntroduce();
    }
  }, [study]);

  return (
    <div className="p-10 space-y-8 text-black">
      {/* 키워드 태그 */}
      <div className="space-x-2">
        {study.keywords?.map((keyword, idx) => (
          <span
            key={idx}
            className="bg-[#FBEDD7] text-sm px-3 py-1 rounded-full"
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* 제목 + 신청 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{study.title}</h1>
        <Link href={`/studyGroup/${study.id}?tab=enrollment`}>
          <button className="py-3 px-6 rounded-md bg-[#4B2E1E] text-white font-semibold">
            스터디 신청하기
          </button>
        </Link>
      </div>

      {/* 요약 정보 */}
      <div className="grid grid-cols-2 gap-y-3 w-64">
        <div>스터디 방식</div>
        <div className="font-semibold">{study.meetingMethod}</div>

        <div>장소</div>
        <div className="font-semibold">
          {getSidoName(study.sido.sidoCd)}
        </div>

        <div>인원</div>
        <div className="font-semibold">{study.maxMembers ? `${study.maxMembers.toLocaleString()}명` : "미정"}</div>

        <div>참가비</div>
        <div className="font-semibold">
          {study.amount ? `${study.amount.toLocaleString()}원` : "무료"}
        </div>
      </div>

      {/* 일정 정보 */}
      <div>
        <h2 className="text-xl font-bold mt-10 mb-2">모임 일정</h2>
        <hr className="mb-4" />
        {study.weeklySchedules?.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {study.weeklySchedules.map((w, i) => (
              <li key={i}>
                {w.dayOfWeek} {w.startTime} ~ {w.endTime} ({w.periodMinutes}분)
              </li>
            ))}
          </ul>
        ) : (
          <p>모임 일정이 없습니다.</p>
        )}
      </div>

      {/* 소개글 */}
      <div>
        <h2 className="text-xl font-bold mt-10 mb-2">스터디 그룹 소개</h2>
        <hr className="mb-4" />
        <p className="leading-relaxed whitespace-pre-line">{introduce}</p>
      </div>
    </div>
  );
}
