import { useEffect, useState } from "react";

export default function Info({ study }) {
  const [isEditing, setIsEditing] = useState(false);

  const [tag, setTag] = useState(study.tag || "");
  const [content, setContent] = useState(study.content || "");
  const [schedule, setSchedule] = useState(study.schedule || "");
  const [place, setPlace] = useState(study.place || "");
  const [maxMember, setMaxMember] = useState(study.maxMember || "");
  const [fee, setFee] = useState(study.fee || "");

  const handleSave = () => {
    const updatedStudy = {
      ...study,
      tag,
      content,
      schedule,
      place,
      maxMember,
      fee,
    };

    const studies = JSON.parse(localStorage.getItem("studyData") || "[]");
    const updatedStudies = studies.map((s) =>
      s.id === study.id ? updatedStudy : s
    );
    localStorage.setItem("studyData", JSON.stringify(updatedStudies));
    alert("스터디 그룹 정보가 저장되었습니다!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // 원래 값으로 되돌리기
    setTag(study.tag || "");
    setContent(study.content || "");
    setSchedule(study.schedule || "");
    setPlace(study.place || "");
    setMaxMember(study.maxMember || "");
    setFee(study.fee || "");
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {isEditing ? (
            <div className="space-y-3">
                <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="태그"
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="제목"
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="일정"
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="장소"
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text"
                    value={maxMember}
                    onChange={(e) => setMaxMember(e.target.value)}
                    placeholder="정원"
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    placeholder="참가비"
                    className="w-full border rounded px-3 py-2"
                />

                <div className="flex gap-3 mt-4">
                    <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                    저장
                    </button>
                    <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md"
                    >
                    취소
                    </button>
                </div>
            </div>
            ) : (
                <>
                <div><strong>태그:</strong> {tag}</div>
                <div><strong>제목:</strong> {content}</div>
                <div><strong>일정:</strong> {schedule}</div>
                <div><strong>장소:</strong> {place}</div>
                <div><strong>정원:</strong> {maxMember}</div>
                <div><strong>참가비:</strong> {fee}</div>

                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#4B2E1E] text-white px-4 py-2 rounded-md mt-4"
                >
                    수정하기
                </button>
            </>
        )}
    </div>
  );
}
