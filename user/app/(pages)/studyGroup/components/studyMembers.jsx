"use client";

export default function StudyMembers({ study }) {
  const currentEmail = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === currentEmail);
  const name = user?.name;

  const isAuthorized =
    study?.member?.role_leader?.includes(name) ||
    study?.member?.role_member?.includes(name);

  if (!isAuthorized) {
    return <p className="text-red-500">접근 권한이 없습니다.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">스터디 멤버</h2>
      <ul className="list-disc ml-6 space-y-1">
        {study.members.map((member, index) => (
          <li key={index}>
            {member.name} -{" "}
            <span className="text-sm text-gray-500">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
