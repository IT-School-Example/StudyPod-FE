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

export default function CreateGroup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [meetingMethod, setMeetingMethod] = useState("ONLINE");
  const [feeType, setFeeType] = useState("MONTHLY");
  const [amount, setAmount] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [selectedSido, setSelectedSido] = useState({ sidoCd: "", sidoNm: "" });
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

    if (!title || !description || !maxMembers || !amount || !subjectArea || !selectedSido.sidoCd) {
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
        sido: selectedSido,
      },
      subjectArea: {
        subject: subjectArea,
      },
      keywords: keywords.split(",").map((k) => k.trim()),
      weeklySchedules,
    };

    try {
      await fetch("/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.push("/");
    } catch (err) {
      console.error("스터디 생성 오류:", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white items-center px-4 py-10 text-black">
      <Navbar />
      <div className="border w-full max-w-3xl p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">스터디 개설</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <input placeholder="스터디 제목" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-md px-4 py-2 w-full" />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">주제</label>
              <select value={subjectArea} onChange={(e) => setSubjectArea(e.target.value)} className="border rounded-md px-2 py-2 w-full">
                <option value="">-- 선택하세요 --</option>
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">키워드 (쉼표로 구분)</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="border rounded-md px-4 py-2 w-full" />
            </div>
          </div>

          <div>
            <label className="block mb-1">스터디 설명</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded-md px-4 py-2 w-full min-h-[100px]" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">참가비 타입</label>
              <select value={feeType} onChange={(e) => setFeeType(e.target.value)} className="border rounded-md px-2 py-2 w-full">
                {feeTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">참가비</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded-md px-4 py-2 w-full" />
            </div>
          </div>

          <div>
            <label className="block mb-1">최대 인원</label>
            <input value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} className="border rounded-md px-4 py-2 w-full" />
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
                    /> {option.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block mb-1">지역 (시도)</label>
              <select
                value={selectedSido.sidoCd}
                onChange={(e) => {
                  const selected = sidoOptions.find((s) => s.sidoCd === e.target.value);
                  setSelectedSido(selected || { sidoCd: "", sidoNm: "" });
                }}
                className="border rounded-md px-2 py-2 w-full"
              >
                <option value="">-- 선택하세요 --</option>
                {sidoOptions.map((option) => (
                  <option key={option.sidoCd} value={option.sidoCd}>{option.sidoNm}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-2">스터디 일정 (요일 + 시간)</label>
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

          <button type="submit" className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold">
            생성하기
          </button>
        </form>
      </div>
    </div>
  );
}
