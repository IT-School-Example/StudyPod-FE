"use client";
import { useEffect, useState } from "react";

export default function Request({study}) {
  const [requests, setRequests] = useState([]);

  const filteredRequests = Array.isArray(requests)
    ? requests.filter((r) => r.studyDetail === study.detail)
    : [];

  useEffect(() => {
    fetch("/joinMemberList.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          setRequests([]);
        }
      })
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
      <table className="w-full border border-gray-300 mb-5 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">번호</th>
            <th className="border p-2">회원</th>
            <th className="border p-2">소개</th>
            <th className="border p-2">수락</th>
            <th className="border p-2">거절</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, idx) => (
              <tr key={req.id}>
                <td className="border p-2 text-center">{idx + 1}</td>
                <td className="border p-2 text-center">{req.user}</td>
                <td className="border p-2 text-center">{req.introduce}</td>
                <td className="border p-2 text-center">
                  {req.status === "pending" && (
                    <button
                      onClick={() => updateStatus(req.id, req.user, req.studyDetail, "approved")}
                      className="text-green-500 hover:underline"
                    >
                      수락
                    </button>
                  )}
                </td>
                <td className="border p-2 text-center">
                  {req.status === "pending" && (
                    <button
                      onClick={() => updateStatus(req.id, req.user, "rejected")}
                      className="text-red-500 hover:underline"
                    >
                      거절
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan={5}>
                신청자가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
