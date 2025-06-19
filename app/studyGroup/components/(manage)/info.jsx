"use client";

import { useEffect, useState } from "react";

export default function Info({ study }) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    maxMembers: "",
    meetingMethod: "",
    recruitmentStatus: "",
    feeType: "",
    amount: "",
  });

  useEffect(() => {
    if (study) {
      setForm({
        title: study.title || "",
        description: study.description || "",
        maxMembers: study.maxMembers || "",
        meetingMethod: study.meetingMethod || "",
        recruitmentStatus: study.recruitmentStatus || "",
        feeType: study.feeType || "",
        amount: study.amount || "",
      });
    }
  }, [study]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const updatedStudy = {
      title: form.title,
      description: form.description,
      maxMembers: Number(form.maxMembers),
      meetingMethod: form.meetingMethod,
      recruitmentStatus: form.recruitmentStatus,
      feeType: form.feeType,
      amount: Number(form.amount),
      leader: {
        id: study.leader?.id || 1,
      },
      address: {
        id: study.address?.id || 1,
      },
      subjectArea: {
        id: study.subjectArea?.id || 1,
      },
      keywords: study.keywords || [],
      weeklySchedules: study.weeklySchedules || [
        {
          dayOfWeek: "MONDAY",
          startTime: "10:00:00",
          endTime: "12:00:00",
          periodMinutes: 120,
          periodDuration: "PT2H",
        },
      ],
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedStudy));
    formData.append("file", ""); // 파일 없으면 빈 문자열로 보내도 됨

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/${study.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const responseText = await res.text();
      console.log("응답 상태 코드:", res.status);
      console.log("응답 내용:", responseText);

      if (!res.ok) throw new Error("수정 실패");

      alert("스터디 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
    } catch (err) {
      console.error("수정 오류:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };


  const handleCancel = () => {
    setForm({
      title: study.title || "",
      description: study.description || "",
      maxMembers: study.maxMembers || "",
      meetingMethod: study.meetingMethod || "",
      recruitmentStatus: study.recruitmentStatus || "",
      feeType: study.feeType || "",
      amount: study.amount || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {isEditing ? (
        <div className="space-y-3">
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="제목" />
          <input name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="설명" />
          <input name="maxMembers" value={form.maxMembers} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="정원" />
          <input name="meetingMethod" value={form.meetingMethod} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="방식 (ONLINE/OFFLINE)" />
          <input name="recruitmentStatus" value={form.recruitmentStatus} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="모집 상태 (RECRUITING/CLOSED)" />
          <input name="feeType" value={form.feeType} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="참가비 유형 (MONTHLY/FREE 등)" />
          <input name="amount" value={form.amount} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="금액 (숫자)" />

          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md">
              저장
            </button>
            <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded-md">
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div><strong>제목:</strong> {form.title}</div>
          <div><strong>설명:</strong> {form.description}</div>
          <div><strong>정원:</strong> {form.maxMembers}</div>
          <div><strong>방식:</strong> {form.meetingMethod}</div>
          <div><strong>모집 상태:</strong> {form.recruitmentStatus}</div>
          <div><strong>참가비 유형:</strong> {form.feeType}</div>
          <div><strong>금액:</strong> {form.amount}</div>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#4B2E1E] text-white px-4 py-2 rounded-md mt-4"
          >
            수정하기
          </button>
        </>
      )}
    </div>
  );
}
