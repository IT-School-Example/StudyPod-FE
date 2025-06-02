"use client";
import { useEffect, useState } from "react";

export default function Request({ study }) {
  const [requests, setRequests] = useState([]);

  const filteredRequests = Array.isArray(requests)
    ? requests.filter((r) => r.studyDetail === study.detail)
    : [];

  useEffect(() => {
    fetch("/joinMemberList.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
        else setRequests([]);
      });
  }, []);

  const updateStatus = async (id, user, studyDetail, status) => {
    try {
      await fetch("/api/study/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user, studyDetail, status }),
      });
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
      {filteredRequests.length > 0 ? (
        filteredRequests.map((req, idx) => (
          <div
            key={req.id}
            className="grid grid-cols-5 items-center py-2 px-3 text-sm hover:bg-gray-50"
          >
            <div>{idx + 1}</div>
            <div>{req.user}</div>
            <div>{req.introduce}</div>
            <div>
              {req.status === "pending" && (
                <button
                  onClick={() => updateStatus(req.id, req.user, req.studyDetail, "approved")}
                  className="text-green-500 hover:underline"
                >
                  수락
                </button>
              )}
            </div>
            <div>
              {req.status === "pending" && (
                <button
                  onClick={() => updateStatus(req.id, req.user, req.studyDetail, "rejected")}
                  className="text-red-500 hover:underline"
                >
                  거절
                </button>
              )}
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
