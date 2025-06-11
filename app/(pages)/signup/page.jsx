"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { FiEye } from "react-icons/fi";

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1,2로 다음단계 버튼 구현
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  
  const handleSignUp = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          email,
          password,
          name,
          nickname: "",
          role: "ROLE_USER",
        },
      }),
    });

    const responseText = await response.text(); // 응답 본문 추출
    console.log("🔻 회원가입 응답 상태:", response.status);
    console.log("🔻 회원가입 응답 내용:", responseText);

    if (!response.ok) {
      throw new Error("회원가입 실패");
    }

    // 백엔드 회원가입 성공 후 최소한의 정보만 저장
    localStorage.setItem("currentUser", email);
    alert("회원가입이 완료되었습니다.");
    router.push("/");
  } catch (error) {
    console.error("회원가입 오류:", error);
    alert("회원가입 중 문제가 발생했습니다.");
  }
};


  const handleSendCode = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/mailSend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverEmail: email }),
      });
      if (!res.ok) throw new Error("인증코드 전송 실패");
      alert("인증코드가 전송되었습니다.");
    } catch (err) {
      console.error(err);
      alert("인증코드 전송에 실패했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/mailCheck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) throw new Error("인증 실패");

      setCodeVerified(true);
      alert("인증이 완료되었습니다.");
    } catch (err) {
      console.error(err);
      alert("인증코드가 일치하지 않습니다.");
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="w-full h-screen flex items-center justify-center bg-[#faeed5]">
        <Image
          className="w-64 h-64"
          src="/logobg.png"
          width={1024}
          height={1024}
          alt="bg"
        />
      </div>

      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          <h1 className="text-2xl font-bold text-center mb-10 text-black">
            회원가입
          </h1>

          {step === 1 ? (
            <>
              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">
                  인증코드
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  className="flex-1 py-2 rounded-md bg-gray-100 text-black font-medium"
                  onClick={handleSendCode}
                >
                  발급
                </button>
                <button 
                  className="flex-1 py-2 rounded-md bg-gray-500 text-white font-medium"
                  onClick={handleVerifyCode}
                >
                  확인
                </button>
              </div>

              <button
                className={`w-full py-3 rounded-md ${
                  codeVerified ? "bg-[#4B2E1E] text-white" : "bg-gray-300 text-gray-500"
                } font-semibold mt-6`}
                disabled={!codeVerified}
                onClick={() => codeVerified && setStep(2)}
              >
                다음 단계
              </button>
            </>
          ) : (
            <>
              {/**다음단계 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-md px-4 py-2 outline-none"
                />
              </div>

              <div className="mb-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-md px-4 py-2 pr-10 outline-none"
                  />
                  <FiEye
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                8~20자 이내, 영문 알파벳, 특수문자(!, @, #, $, %, ^, &, *) 를
                1자 이상 포함해야 합니다
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "confirmPassword"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded-md px-4 py-2 pr-10 outline-none"
                  />
                  <FiEye
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </div>

              <button
                className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold"
                onClick={handleSignUp}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
