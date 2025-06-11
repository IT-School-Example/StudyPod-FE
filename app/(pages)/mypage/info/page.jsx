"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Info() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "" });

  useEffect(() => {
    const currentEmail = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userData = users.find((u) => u.email === currentEmail);
    if (userData) {
      setUser(userData);
      setFormData({ name: userData.name || "", password: userData.password || "" });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, ...formData } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUser((prev) => ({ ...prev, ...formData }));
    setEditMode(false);
    alert("회원 정보가 수정되었습니다.");
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        마이페이지
      </h1>

      <div className="space-y-4 text-gray-700 mb-8">
        <p>
          <span className="font-medium">이메일:</span> {user.email}
        </p>

        {editMode ? (
          <>
            <p>
              <span className="font-medium">이름:</span>{" "}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded px-2 py-1 ml-2"
              />
            </p>
            <p>
              <span className="font-medium">비밀번호:</span>{" "}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded px-2 py-1 ml-2"
              />
            </p>
          </>
        ) : (
          <>
            <p>
              <span className="font-medium">이름:</span>{" "}
              {user.name || "저장된 이름 없음"}
            </p>
            <p>
              <span className="font-medium">비밀번호:</span> {user.password}
            </p>
          </>
        )}
      </div>

      <div className="flex space-x-2">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              저장
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-xl transition"
            >
              취소
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            회원 정보 수정
          </button>
        )}
      </div>

      <button
        className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition"
      >
        회원삭제
      </button>
    </div>
  );
}
