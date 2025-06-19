import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function Introduce({ study }) {
  const [introduce, setIntroduce] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [introduceId, setIntroduceId] = useState(null);
  const [posted, setPosted] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchIntroduce = async () => {
      try {
        // 소개글 존재 여부 확인
        const existRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/introduce/exist/${study.id}`);
        const exists = await existRes.json();

        if (!exists) {
          // 소개글 없음 → 작성 모드 진입
          setEditMode(true);
          setIsNew(true);
          setIntroduce("");
          setPosted(false);
        } else {
          // 소개글 있음 → 조회
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/introduce/study/${study.id}`);
          if (!res.ok) throw new Error("소개글 조회 실패");
          const data = await res.json();
          const intro = data.data;
          setIntroduce(intro.content);
          setIntroduceId(intro.id);
          setPosted(intro.posted);
        }
      } catch (err) {
        console.error("소개글 처리 중 오류", err);
      }
    };

    fetchIntroduce();
  }, [study.id]);

  const handleSave = async () => {
    try {
      const data = {
        content: introduce,
        posted,
        studyGroup: { id: study.id },
      };

      const method = isNew ? "POST" : "PATCH";
      const url = isNew
        ? `${process.env.NEXT_PUBLIC_API_URL}/introduce`
        : `${process.env.NEXT_PUBLIC_API_URL}/introduce/update`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data}),
      });

      if (!res.ok) throw new Error("소개글 저장 실패");

      alert("소개글이 저장되었습니다.");
      setEditMode(false);
      setIsNew(false);
    } catch (error) {
      console.error(error);
      alert("소개글 저장 실패");
    }
  };

  const handleTogglePosted = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/introduce/study/${study.id}/toggle-posted`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) throw new Error("응답 실패");

      const result = await res.json();
      const updated = result.data;

      if (updated?.posted === undefined) {
        console.error("응답 데이터에 Posted가 없습니다:", updated);
        return;
      }

      setPosted(result.data.posted);
    } catch (err) {
      console.error("개시여부 변경 실패:", err);
      alert("개시여부 변경 실패");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mt-10 mb-6">
        <h1 className="text-2xl font-bold">스터디 소개글</h1>
        {introduceId && (
          <button onClick={handleTogglePosted} className="text-2xl">
            {posted ? (
              <FaToggleOn className="text-green-500" />
            ) : (
              <FaToggleOff className="text-gray-400" />
            )}
          </button>
        )}
      </div>

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
            className="bg-[#4B2E1E] text-white px-4 py-2 rounded hover:bg-[#3e2619]"
          >
            {isNew ? "작성하기" : "저장"}
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
