"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import {
  subjectOptions,
  meetingOptions,
  feeTypeOptions,
  sidoOptions,
} from "@/shared/constants";

export default function CreateGroup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [meetingMethod, setMeetingMethod] = useState("ONLINE");
  const [feeType, setFeeType] = useState("MONTHLY");
  const [amount, setAmount] = useState("");
  const [subjectAreaId, setSubjectAreaId] = useState("");
  const [selectedSidoCd, setSelectedSidoCd] = useState("");
  const [keywords, setKeywords] = useState("");
  const [weeklySchedule, setWeeklySchedule] = useState({
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
  });
  const { user } = useUser();

  const router = useRouter();

  const handleScheduleChange = (field, value) => {
    setWeeklySchedule((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.id) {
      alert("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    const data = {
      title,
      description,
      maxMembers: Number(maxMembers),
      meetingMethod,
      recruitmentStatus: "RECRUITING",
      feeType,
      amount: Number(amount),
      leader: { id: user.id },
      sido: { sidoCd: selectedSidoCd },
      subjectArea: { id: subjectAreaId },
      keywords: keywords.split(",").map((k) => k.trim()),
      weeklySchedules: [weeklySchedule],
    };

    try {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      formData.append("file", new Blob([])); // 빈 파일 전송

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("스터디 생성 실패");

      router.push(`/mypage/manage`);
    } catch (err) {
      console.error("스터디 생성 오류:", err);
      alert("스터디 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 items-center px-4 text-black">
      <Navbar />
      <div className="border w-full max-w-3xl p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">스터디 개설</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <input
            placeholder="스터디 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">주제</label>
              <select
                value={subjectAreaId}
                onChange={(e) => setSubjectAreaId(Number(e.target.value))}
                className="border rounded-md px-2 py-2 w-full"
              >
                <option value="">-- 선택하세요 --</option>
                {subjectOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">키워드 (쉼표로 구분)</label>
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="border rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">스터디 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-md px-4 py-2 w-full min-h-[100px]"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">참가비 타입</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="border rounded-md px-2 py-2 w-full"
              >
                {feeTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">참가비</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">최대 인원</label>
            <input
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              className="border rounded-md px-4 py-2 w-full"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">스터디 방식</label>
              <div className="flex gap-4">
                {meetingOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="meetingMethod"
                      value={option.value}
                      checked={meetingMethod === option.value}
                      onChange={(e) => setMeetingMethod(e.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block mb-1">지역 (시도)</label>
              <select
                value={selectedSidoCd}
                onChange={(e) => setSelectedSidoCd(e.target.value)}
                className="border rounded-md px-2 py-2 w-full"
              >
                <option value="">-- 선택하세요 --</option>
                {sidoOptions.map((option) => (
                  <option key={option.sidoCd} value={option.sidoCd}>
                    {option.sidoNm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-2">
              스터디 일정 (요일 + 시간)
            </label>
            <div className="flex gap-2 mb-2">
              <select
                value={weeklySchedule.dayOfWeek}
                onChange={(e) => handleScheduleChange("dayOfWeek", e.target.value)}
                className="border rounded-md px-2"
              >
                <option value="MONDAY">월요일</option>
                <option value="TUESDAY">화요일</option>
                <option value="WEDNESDAY">수요일</option>
                <option value="THURSDAY">목요일</option>
                <option value="FRIDAY">금요일</option>
                <option value="SATURDAY">토요일</option>
                <option value="SUNDAY">일요일</option>
              </select>
              <input
                type="time"
                step="300"
                value={weeklySchedule.startTime}
                onChange={(e) => handleScheduleChange("startTime", e.target.value)}
                className="border px-2"
              />
              <input
                type="time"
                step="300"
                value={weeklySchedule.endTime}
                onChange={(e) => handleScheduleChange("endTime", e.target.value)}
                className="border px-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold"
          >
            생성하기
          </button>
        </form>
      </div>
    </div>
  );
}
