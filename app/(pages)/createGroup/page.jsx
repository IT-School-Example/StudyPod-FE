"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

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
  { id: 11, value: "ETC" },
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
  const [subjectAreaId, setSubjectAreaId] = useState("");
  const [selectedSidoCd, setSelectedSidoCd] = useState("");
  const [keywords, setKeywords] = useState("");
  const [weeklySchedule, setWeeklySchedule] = useState({
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
  });
  const [userId, setUserId] = useState();

  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("회원 정보를 불러올 수 없습니다.");

        const json = await res.json();
        setUserId(json.id)
      } catch (err) {
        console.error(err);
        alert("로그인이 필요합니다.");
        router.push("/login");
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleScheduleChange = (field, value) => {
    setWeeklySchedule(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
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
      leader: { id: userId },
      address: { id: selectedSidoCd },
      subjectArea: { id: subjectAreaId },
      keywords: keywords.split(",").map(k => k.trim()),
      weeklySchedules: [weeklySchedule],
    };

    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
      formData.append("file", new Blob([])); // 빈 파일 전송

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("스터디 생성 실패");

      router.push(`/study-group/${study.id}?tab=manage`);
    } catch (err) {
      console.error("스터디 생성 오류:", err);
      alert("스터디 생성 중 오류가 발생했습니다.");
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
              <select value={subjectAreaId} onChange={(e) => setSubjectAreaId(Number(e.target.value))} className="border rounded-md px-2 py-2 w-full">
                <option value="">-- 선택하세요 --</option>
                {subjectOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.value}</option>
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
                {feeTypeOptions.map(option => (
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
                {meetingOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-1">
                    <input type="radio" name="meetingMethod" value={option.value} checked={meetingMethod === option.value} onChange={(e) => setMeetingMethod(e.target.value)} />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block mb-1">지역 (시도)</label>
              <select value={selectedSidoCd} onChange={(e) => setSelectedSidoCd(e.target.value)} className="border rounded-md px-2 py-2 w-full">
                <option value="">-- 선택하세요 --</option>
                {sidoOptions.map(option => (
                  <option key={option.sidoCd} value={option.sidoCd}>{option.sidoNm}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-2">스터디 일정 (요일 + 시간)</label>
            <div className="flex gap-2 mb-2">
              <select value={weeklySchedule.dayOfWeek} onChange={(e) => handleScheduleChange("dayOfWeek", e.target.value)} className="border rounded-md px-2">
                <option value="MONDAY">월요일</option>
                <option value="TUESDAY">화요일</option>
                <option value="WEDNESDAY">수요일</option>
                <option value="THURSDAY">목요일</option>
                <option value="FRIDAY">금요일</option>
                <option value="SATURDAY">토요일</option>
                <option value="SUNDAY">일요일</option>
              </select>
              <input type="time" step="300" value={weeklySchedule.startTime} onChange={(e) => handleScheduleChange("startTime", e.target.value)} className="border px-2" />
              <input type="time" step="300" value={weeklySchedule.endTime} onChange={(e) => handleScheduleChange("endTime", e.target.value)} className="border px-2" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold">
            생성하기
          </button>
        </form>
      </div>
    </div>
  );
}
