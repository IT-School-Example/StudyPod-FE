"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Info() {
  const router = useRouter();
  const {user} = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    code: "",
  });
  const [codeVerified, setCodeVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/mailSend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverEmail: formData.email }),
      });
      if (!res.ok) throw new Error();
      alert("인증 코드가 전송되었습니다.");
    } catch {
      alert("이메일 인증 코드 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/mailCheck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: formData.code }),
      });
      if (!res.ok) throw new Error();
      setCodeVerified(true);
      alert("이메일 인증 완료!");
    } catch {
      alert("인증코드가 일치하지 않습니다.");
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (formData.email !== user.email && !codeVerified) {
      alert("이메일을 변경하려면 인증이 필요합니다.");
      return;
    }

    try {
      if (formData.nickname !== user.nickname) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-nickname/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: { nickname: formData.nickname } }),
        });
      }
      if (formData.password.trim() !== "") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-pw/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: { password: formData.password } }),
        });
      }
      if (formData.email !== user.email && codeVerified) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-email/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: { email: formData.email } }),
        });
      }

      alert("회원 정보가 수정되었습니다.");
      setEditMode(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("정말로 회원 탈퇴하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signout`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("회원 탈퇴 실패");

      alert("탈퇴가 완료되었습니다.");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">마이페이지</h1>

      <div className="space-y-4 text-gray-700 mb-8">
        {editMode ? (
          <>
            <div>
              <label className="block font-medium">이메일</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
              {formData.email !== user.email && (
                <div className="mt-2 flex gap-2">
                  <button onClick={handleSendCode} className="bg-gray-300 px-3 py-1 rounded">인증코드 발송</button>
                  <input
                    name="code"
                    type="text"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="인증코드 입력"
                    className="border rounded px-2 py-1"
                  />
                  <button onClick={handleVerifyCode} className="bg-blue-500 text-white px-3 py-1 rounded">확인</button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium">닉네임</label>
              <input
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>

            <div>
              <label className="block font-medium">비밀번호</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </>
        ) : (
          <>
            <p><span className="font-medium">이메일:</span> {user.email}</p>
            <p><span className="font-medium">이름:</span> {user.name}</p>
            <p><span className="font-medium">닉네임:</span> {user.nickname || "없음"}</p>
          </>
        )}
      </div>

      <div className="flex space-x-2">
        {editMode ? (
          <>
            <button onClick={handleSave} className="flex-1 bg-blue-500 text-white py-2 rounded">저장</button>
            <button onClick={() => setEditMode(false)} className="flex-1 bg-gray-300 py-2 rounded">취소</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="w-full bg-yellow-500 text-white py-2 rounded">회원 정보 수정</button>
        )}
      </div>

      <button 
        onClick={handleDelete}
        className="w-full mt-4 bg-red-500 text-white py-2 rounded"
      >
        회원 삭제
      </button>
    </div>
  );
}
