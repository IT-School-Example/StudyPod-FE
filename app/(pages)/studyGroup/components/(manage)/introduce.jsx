import React, { useState, useEffect } from "react";

export default function Introduce({ study }) {
  const [introduce, setIntroduce] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch("/studyData.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const studyData = data.find((d) => d.detail === study.detail);
          if (studyData) setIntroduce(studyData.introduce);
        }
      });
  }, [study.detail]);

  const handleSave = async () => {
    try {
      await fetch("/api/study/updateIntroduce", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detail : study.detail, introduce }),
      });
      setEditMode(false);
      alert("소개글이 저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert("소개글 저장 실패");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mt-10 mb-6">스터디 소개글</h1>

      {editMode ? (
        <textarea
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
          className="border rounded-md p-2 w-full h-48"
        />
      ) : (
        <div className="whitespace-pre-wrap border rounded-md p-4 bg-gray-50">
          {introduce}
        </div>
      )}

      <div className="mt-4 space-x-2">
        {editMode ? (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            저장
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-[#4B2E1E] text-white px-4 py-2 rounded hover:bg-[#3e2619]"
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
}
