"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

const subjectOptions = [
  { value: "LANGUAGE", label: "어학 관련 스터디" },
  { value: "IT", label: "IT 및 프로그래밍 관련 스터디" },
  { value: "EXAM", label: "자격증 취득 및 시험 준비 스터디" },
  { value: "JOB", label: "취업 준비 및 경력 개발 스터디" },
  { value: "SCHOOL", label: "학교 과목 관련 스터디" },
  { value: "HOBBY", label: "취미 및 자기 계발 스터디" },
  { value: "CULTURE", label: "문화 및 예술 관련 스터디" },
  { value: "SCIENCE", label: "과학 관련 스터디" },
  { value: "HUMANITIES", label: "인문학 관련 스터디" },
  { value: "BUSINESS", label: "경영 및 경제 관련 스터디" },
  { value: "ETC", label: "기타 분야의 스터디" },
];

const meetingOptions = [
  { value: "ONLINE", label: "온라인" },
  { value: "OFFLINE", label: "오프라인" },
  { value: "BOTH", label: "혼합" },
];

const feeTypeOptions = [
  { value: "MONTHLY", label: "매월" },
  { value: "YEARLY", label: "매년" },
  { value: "PER_EVENT", label: "모임마다" },
  { value: "ONE_TIME", label: "가입 시 1회" },
];

export default function CreateGroup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [meetingMethod, setMeetingMethod] = useState("ONLINE");
  const [feeType, setFeeType] = useState("MONTHLY");
  const [amount, setAmount] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [sido, setSido] = useState("");
  const [keywords, setKeywords] = useState("");
  const [weeklySchedules, setWeeklySchedules] = useState([
    { dayOfWeek: "MONDAY", startTime: "", endTime: "" },
  ]);
  const router = useRouter();

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...weeklySchedules];
    updatedSchedules[index][field] = value;
    setWeeklySchedules(updatedSchedules);
  };

  const handleAddSchedule = () => {
    setWeeklySchedules([
      ...weeklySchedules,
      { dayOfWeek: "MONDAY", startTime: "", endTime: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !maxMembers || !amount || !subjectArea || !sido) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    const body = {
      title,
      description,
      maxMembers: Number(maxMembers),
      meetingMethod,
      recruitmentStatus: "RECRUITING",
      feeType,
      amount: Number(amount),
      address: {
        sido: {
          sidoCd: "",
          sidoNm: sido,
        },
      },
      subjectArea: {
        subject: subjectArea,
      },
      keywords: keywords.split(",").map((k) => k.trim()),
      weeklySchedules,
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.push("/studyGroup/list");
    } catch (err) {
      console.error("스터디 생성 오류:", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar />
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 개설 페이지</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-lg">
        <input placeholder="스터디 제목" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-md px-4 py-2" />
        <textarea placeholder="스터디 설명" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded-md px-4 py-2" />
        <input placeholder="최대 인원" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} className="border rounded-md px-4 py-2" />
        <input placeholder="참가비" value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded-md px-4 py-2" />

        <div>
          <label className="block mb-1">스터디 방식:</label>
          {meetingOptions.map((option) => (
            <label key={option.value} className="mr-4">
              <input
                type="radio"
                name="meetingMethod"
                value={option.value}
                checked={meetingMethod === option.value}
                onChange={(e) => setMeetingMethod(e.target.value)}
              /> {option.label}
            </label>
          ))}
        </div>

        <div>
          <label className="block mb-1">참가비 타입:</label>
          <select value={feeType} onChange={(e) => setFeeType(e.target.value)} className="border rounded-md px-2 py-1">
            {feeTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">주제:</label>
          <select value={subjectArea} onChange={(e) => setSubjectArea(e.target.value)} className="border rounded-md px-2 py-1">
            <option value="">-- 선택하세요 --</option>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <input placeholder="지역 (시도만)" value={sido} onChange={(e) => setSido(e.target.value)} className="border rounded-md px-4 py-2" />
        <input placeholder="키워드 (쉼표로 구분)" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="border rounded-md px-4 py-2" />

        <div>
          <h2 className="font-semibold">스터디 일정 (요일 + 시간):</h2>
          {weeklySchedules.map((schedule, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select value={schedule.dayOfWeek} onChange={(e) => handleScheduleChange(index, "dayOfWeek", e.target.value)} className="border rounded-md px-2">
                <option value="MONDAY">월요일</option>
                <option value="TUESDAY">화요일</option>
                <option value="WEDNESDAY">수요일</option>
                <option value="THURSDAY">목요일</option>
                <option value="FRIDAY">금요일</option>
                <option value="SATURDAY">토요일</option>
                <option value="SUNDAY">일요일</option>
              </select>
              <input type="time" value={schedule.startTime} onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)} className="border px-2" />
              <input type="time" value={schedule.endTime} onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)} className="border px-2" />
            </div>
          ))}
          <button type="button" onClick={handleAddSchedule} className="text-sm text-blue-600">+ 일정 추가</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          생성하기
        </button>
      </form>
    </div>
  );
}
