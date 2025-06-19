"use client";
import { useEffect, useState } from "react";
import UserName from "@/components/UserName";

export default function Request({ study }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!study?.id) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-groups/${study.id}/enrollments?status=PENDING`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (result.resultCode === "OK") {
          setRequests(result.data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("신청자 목록 로딩 실패:", error);
        setRequests([]);
      }
    };

    fetchRequests();
  }, [study?.id]);

  const updateStatus = async (enrollment, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments/${enrollment.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            introduce: enrollment.introduce,
            status: newStatus,
            user: { id: enrollment.user.id },
            studyGroup: { id: enrollment.studyGroup.id },
          }),
        }
      );

      if (!res.ok) throw new Error("상태 변경 실패");
      setRequests((prev) => prev.filter((r) => r.id !== enrollment.id));
    } catch (error) {
      console.error(error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-5 font-semibold bg-gray-50 py-2 px-3 text-sm text-gray-700">
        <div>번호</div>
        <div>회원</div>
        <div>소개</div>
        <div>수락</div>
        <div>거절</div>
      </div>
      {requests.length > 0 ? (
        requests.map((req, idx) => (
          <div
            key={req.id}
            className="grid grid-cols-5 items-center py-2 px-3 text-sm hover:bg-gray-50"
          >
            <div>{idx + 1}</div>
            <div><UserName userId={req.user.id} /></div>
            <div>{req.introduce}</div>
            <div>
              <button
                onClick={() => updateStatus(req, "APPROVED")}
                className="text-green-500 hover:underline"
              >
                수락
              </button>
            </div>
            <div>
              <button
                onClick={() => updateStatus(req, "REJECTED")}
                className="text-red-500 hover:underline"
              >
                거절
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="py-3 px-3 text-center text-sm text-gray-500">
          신청자가 없습니다.
        </div>
      )}
    </div>
  );
}
