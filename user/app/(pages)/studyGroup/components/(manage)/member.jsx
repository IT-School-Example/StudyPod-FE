export default function Member({ study }) {
  const studyList = Array.isArray(study) ? study : [study];

  const rows = studyList.flatMap((item, studyIndex) => {
    const members = [
      { name: item.member.role_leader, role: "리더" },
      ...(item.member.role_member || []).map(name => ({ name, role: "일반회원" })),
    ];
    return members.map((member, memberIndex) => ({
      studyName: item.detail,
      memberName: member.name,
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
          key={`${row.studyId}-${row.memberName}`}
          className="grid grid-cols-5 items-center py-2 px-3 text-sm hover:bg-gray-50"
        >
          <div>{index + 1}</div>
          <div>{row.studyName}</div>
          <div>{row.memberName}</div>
          <div>{row.role}</div>
          <div>
            <button
              onClick={() => alert(`강퇴 기능 구현 필요 (스터디 ID: ${row.studyId}, 구성원: ${row.memberName})`)}
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
