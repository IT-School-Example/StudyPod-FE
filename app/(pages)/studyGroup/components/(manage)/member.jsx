"use client";

import { useEffect, useState } from "react";

export default function Member({ study }) {
  const studyList = Array.isArray(study) ? study : [study];
  const [displayNames, setDisplayNames] = useState({});
  const [memberMap, setMemberMap] = useState({}); // { studyId: [{ id, role }] }

  // 회원 조회 + 이름 조회
  useEffect(() => {
    const fetchMembersAndNames = async () => {
      const allMemberEntries = [];

      for (const item of studyList) {
        const studyId = item.id;
        const studyMembers = [];

        // 1. 리더 추가
        if (item.leader?.id) {
          studyMembers.push({ id: item.leader.id, role: "리더" });
        }

        // 2. 일반회원 조회 API 호출
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/study-groups/${studyId}/users?enrollmentStatus=APPROVED`,
            { method: "GET", credentials: "include" }
          );
          const result = await res.json();

          if (result.resultCode === "OK" && Array.isArray(result.data)) {
            const approvedUsers = result.data;
            approvedUsers.forEach((user) => {
              if (user.id !== item.leader?.id) {
                studyMembers.push({ id: user.id, role: "일반회원" });
              }
            });
          }
        } catch (e) {
          console.error(`스터디 ID ${studyId}의 회원 목록 조회 실패`, e);
        }

        allMemberEntries.push([studyId, studyMembers]);
      }

      const memberMapObject = Object.fromEntries(allMemberEntries);
      setMemberMap(memberMapObject);

      const allUserIds = allMemberEntries.flatMap(([, members]) =>
        members.map((m) => m.id)
      );
      const uniqueIds = [...new Set(allUserIds)];

      const results = await Promise.allSettled(
        uniqueIds.map(async (id) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}/summary`, {
              method: "GET",
              credentials: "include",
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            return { id, name: data.data.displayName };
          } catch (e) {
            return { id, name: "이름없음" };
          }
        })
      );

      const nameMap = {};
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          nameMap[result.value.id] = result.value.name;
        }
      });

      setDisplayNames(nameMap);
    };

    fetchMembersAndNames();
  }, [study]);

  // 렌더링할 행 구성
  const rows = studyList.flatMap((item, studyIndex) => {
    const members = memberMap[item.id] || [];
    return members.map((member, memberIndex) => ({
      studyName: item.title,
      memberId: member.id,
      memberName: displayNames[member.id] || "로딩 중...",
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
          <div>{row.memberName}</div>
          <div>{row.role}</div>
          <div>
            <button
              onClick={() =>
                alert(`강퇴 기능 구현 필요 (스터디 ID: ${row.studyId}, 구성원 ID: ${row.memberId})`)
              }
              className="text-red-500 hover:underline"
            >
              강퇴
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
