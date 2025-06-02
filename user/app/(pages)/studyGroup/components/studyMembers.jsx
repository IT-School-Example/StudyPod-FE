"use client";

export default function StudyMembers({ study }) {
  // members가 없으면 안내 메시지
  if (!study.members || study.members.length === 0) {
    return <p>아직 등록된 멤버가 없습니다.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">스터디 멤버</h2>
      <ul className="list-disc ml-6 space-y-1">
        {study.members.map((member, index) => (
          <li key={index}>
            {member.name} - <span className="text-sm text-gray-500">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
