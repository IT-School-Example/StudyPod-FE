"use client";

import { useEffect, useState } from "react";
import UserName from "@/components/UserName";

export default function Member({ study, onKickSuccess }) {
  const studyList = Array.isArray(study) ? study : [study];
  const [memberMap, setMemberMap] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const entries = await Promise.all(
          studyList.map(async (item) => {
            const studyId = item.id;
            const members = [];

            if (item.leader?.id) {
              members.push({ id: item.leader.id, role: "리더" });
            }

            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/study-groups/${studyId}/enrollments?status=APPROVED`,
                { method: "GET", credentials: "include" }
              );
              const result = await res.json();

              if (result.resultCode === "OK" && Array.isArray(result.data)) {
                result.data.forEach((enrollment) => {
                  const user = enrollment.user;
                  if (user.id !== item.leader?.id) {
                    members.push({ id: user.id, enrollmentId: enrollment.id, role: "일반회원" });
                  }
                });
              }
            } catch (err) {
              console.error(`스터디 ID ${studyId}의 회원 목록 조회 실패`, err);
            }

            return [studyId, members];
          })
        );

        setMemberMap(Object.fromEntries(entries));
      } catch (e) {
        console.error("전체 회원 정보 조회 실패", e);
      }
    };

    fetchMembers();
  }, [study]);

  const rows = studyList.flatMap((item, studyIndex) => {
    const members = memberMap[item.id] || [];
    return members.map((member, memberIndex) => ({
      studyName: item.title,
      memberId: member.id,
      enrollmentId: member.enrollmentId,
      role: member.role,
      studyId: item.id,
      index: `${studyIndex + 1}-${memberIndex + 1}`,
    }));
  });

  return (
    <div>
      <div className="grid grid-cols-5 font-semibold bg-gray-50 py-2 px-3 text-sm text-gray-700">
        <div>번호</div>
        <div>스터디명</div>
        <div>구성원</div>
        <div>권한</div>
        <div>관리</div>
      </div>
      {rows.map((row, index) => (
        <div
          key={`${row.studyId}-${row.memberId}`}
          className="grid grid-cols-5 items-center py-2 px-3 text-sm hover:bg-gray-50"
        >
          <div>{index + 1}</div>
          <div>{row.studyName}</div>
          <div><UserName userId={row.memberId} /></div>
          <div>{row.role}</div>
          <div>
            {row.role !== "리더" && (
              <button
                onClick={async () => {
                  const confirmKick = confirm("정말로 강퇴하시겠습니까?");
                  if (!confirmKick) return;

                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/enrollments/member-kick/${row.enrollmentId}`,
                      {
                        method: "PATCH",
                        credentials: "include",
                      }
                    );
                    const result = await res.json();
                    if (res.ok && result.resultCode === "OK") {
                      alert("강퇴되었습니다.");
                      onKickSuccess?.();
                      setMemberMap((prev) => {
                        const updated = { ...prev };
                        updated[row.studyId] = updated[row.studyId].filter(
                          (m) => m.enrollmentId !== row.enrollmentId
                        );
                        return updated;
                      });
                    } else {
                      alert(`강퇴 실패: ${result.description || "알 수 없는 오류"}`);
                    }
                  } catch (e) {
                    console.error("강퇴 요청 실패", e);
                    alert("강퇴 중 오류가 발생했습니다.");
                  }
                }}
                className="text-red-500 hover:underline"
              >
                강퇴
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
