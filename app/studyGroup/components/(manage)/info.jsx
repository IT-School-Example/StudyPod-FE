"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  subjectOptions,
  meetingOptions,
  feeTypeOptions,
  recruitstatus,
  sidoOptions,
} from "@/shared/constants";

export default function Info({ study }) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const getLabel = (options, value) => options.find((opt) => opt.value === value)?.label || value;
  const getSidoName = (cd) => sidoOptions.find((s) => s.sidoCd === cd)?.sidoNm || cd;
  const getSubjectName = (id) => subjectOptions.find((s) => s.id === id)?.value || id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    maxMembers: "",
    meetingMethod: "",
    recruitmentStatus: "",
    feeType: "",
    amount: "",
    selectedSidoCd: "",
    subjectAreaId: "",
    keywords: "",
    weeklySchedule: {
      dayOfWeek: "MONDAY",
      startTime: "",
      endTime: "",
    },
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
        selectedSidoCd: study.sido?.sidoCd || "",
        subjectAreaId: study.subjectArea?.id || "",
        keywords: study.keywords?.join(", ") || "",
        weeklySchedule: study.weeklySchedules?.[0] || {
          dayOfWeek: "MONDAY",
          startTime: "",
          endTime: "",
        },
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

  const handleScheduleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [field]: value,
      },
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
        id: form.subjectAreaId,
      },
      keywords: form.keywords.split(",").map((k) => k.trim()),
      sido: {
        sidoCd: form.selectedSidoCd,
      },
      weeklySchedules: [form.weeklySchedule],
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedStudy));
    formData.append("file", "");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/${study.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("수정 실패");

      alert("스터디 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
    } catch (err) {
      console.error("수정 오류:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("정말로 스터디를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/${study.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("스터디 삭제 실패");

      alert("스터디 삭제가 완료되었습니다.");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("스터디 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6">
      {isEditing ? (
        <div className="space-y-3">
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="제목" />
          <input name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="설명" />
          <input name="maxMembers" value={form.maxMembers} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="정원" />

          <select name="meetingMethod" value={form.meetingMethod} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {meetingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select name="recruitmentStatus" value={form.recruitmentStatus} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {recruitstatus.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select name="feeType" value={form.feeType} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {feeTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <input name="amount" value={form.amount} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="금액" />

          <select name="selectedSidoCd" value={form.selectedSidoCd} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {sidoOptions.map((opt) => (
              <option key={opt.sidoCd} value={opt.sidoCd}>{opt.sidoNm}</option>
            ))}
          </select>

          <select name="subjectAreaId" value={form.subjectAreaId} onChange={handleChange} className="w-full border rounded px-3 py-2">
            {subjectOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.value}</option>
            ))}
          </select>

          <input name="keywords" value={form.keywords} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="키워드" />

          <div className="flex gap-2">
            <select value={form.weeklySchedule.dayOfWeek} onChange={(e) => handleScheduleChange("dayOfWeek", e.target.value)} className="border rounded-md px-2">
              <option value="MONDAY">월요일</option>
              <option value="TUESDAY">화요일</option>
              <option value="WEDNESDAY">수요일</option>
              <option value="THURSDAY">목요일</option>
              <option value="FRIDAY">금요일</option>
              <option value="SATURDAY">토요일</option>
              <option value="SUNDAY">일요일</option>
            </select>
            <input type="time" step="300" value={form.weeklySchedule.startTime} onChange={(e) => handleScheduleChange("startTime", e.target.value)} className="border px-2" />
            <input type="time" step="300" value={form.weeklySchedule.endTime} onChange={(e) => handleScheduleChange("endTime", e.target.value)} className="border px-2" />
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md">저장</button>
            <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded-md">취소</button>
          </div>
        </div>
      ) : (
        <>
          <div><strong>제목:</strong> {form.title}</div>
          <div><strong>설명:</strong> {form.description}</div>
          <div><strong>정원:</strong> {form.maxMembers ? `${form.maxMembers.toLocaleString()}명` : "미정"}</div>
          <div><strong>방식:</strong> {getLabel(meetingOptions, form.meetingMethod)}</div>
          <div><strong>모집 상태:</strong> {getLabel(recruitstatus, form.recruitmentStatus)}</div>
          <div><strong>참가비 유형:</strong> {getLabel(feeTypeOptions, form.feeType)}</div>
          <div><strong>금액:</strong> {form.amount ? `${form.amount.toLocaleString()}원` : "무료"}</div>
          <div><strong>지역:</strong> {getSidoName(form.selectedSidoCd)}</div>
          <div><strong>주제:</strong> {getSubjectName(Number(form.subjectAreaId))}</div>
          <div><strong>키워드:</strong> {form.keywords}</div>
          <div><strong>일정:</strong> {`${form.weeklySchedule.dayOfWeek} ${form.weeklySchedule.startTime} ~ ${form.weeklySchedule.endTime}`}</div>

          <div className="flex space-x-4 mt-4">
            <button onClick={() => setIsEditing(true)} className="bg-[#4B2E1E] text-white px-4 py-2 rounded-md mt-4">수정하기</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">삭제하기</button>
          </div>
        </>
      )}
    </div>
  );
}