export default function Member({ study }) {
  const studyList = Array.isArray(study) ? study : [study];

  // 각 스터디의 구성원을 하나의 flat 리스트로 변환
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
      <table className="w-full border border-gray-300 mb-5 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">번호</th>
            <th className="border p-2">스터디명</th>
            <th className="border p-2">구성원</th>
            <th className="border p-2">권한</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.studyId}-${row.memberName}`}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">{row.studyName}</td>
              <td className="border p-2 text-center">{row.memberName}</td>
              <td className="border p-2 text-center">{row.role}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => alert(`강퇴 기능 구현 필요 (스터디 ID: ${row.studyId}, 구성원: ${row.memberName})`)}
                  className="text-red-500 hover:underline"
                >
                  강퇴
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
