"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useReducer } from "react";
import { FiEye } from "react-icons/fi";

const initialState = {
  step: 1,
  email: "",
  code: "",
  name: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  showConfirmPassword: false,
  codeVerified: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE":
      return { ...state, [action.field]: !state[action.field] };
    case "SET_STEP":
      return { ...state, step: action.value };
    case "SET_VERIFIED":
      return { ...state, codeVerified: true };
    default:
      return state;
  }
};

export default function SignUp() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, email, code, name, password, confirmPassword, showPassword, showConfirmPassword, codeVerified } = state;

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            email,
            password,
            name,
            nickname:null,
            role: "ROLE_USER",
          },
        }),
      });

      if (!response.ok) throw new Error("회원가입 실패");

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
      // console.error(err);
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

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "인증에 실패했습니다.");
        return;
      }

      dispatch({ type: "SET_VERIFIED" });
      alert("인증이 완료되었습니다.");
    } catch (err) {
      console.error(err);
      alert("인증 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="flex flex-row justify-between">
      <div className="w-full h-screen flex items-center justify-center bg-[#faeed5]">
        <Image src="/logobg.png" width={1024} height={1024} alt="bg" className="w-64 h-64" />
      </div>

      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          <h1 className="text-2xl font-bold text-center mb-10 text-black">회원가입</h1>

          {step === 1 ? (
            <>
              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
                  className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">인증코드</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => dispatch({ type: "SET_FIELD", field: "code", value: e.target.value })}
                  className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-md bg-gray-100 text-black font-medium" onClick={handleSendCode}>발급</button>
                <button className="flex-1 py-2 rounded-md bg-gray-500 text-white font-medium" onClick={handleVerifyCode}>확인</button>
              </div>

              <button
                className={`w-full py-3 rounded-md ${codeVerified ? "bg-[#4B2E1E] text-white" : "bg-gray-300 text-gray-500"} font-semibold mt-6`}
                disabled={!codeVerified}
                onClick={() => dispatch({ type: "SET_STEP", value: 2 })}
              >
                다음 단계
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
                  className="w-full border rounded-md px-4 py-2 outline-none"
                />
              </div>

              <div className="mb-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })}
                    className="w-full border rounded-md px-4 py-2 pr-10 outline-none"
                  />
                  <FiEye
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                    onClick={() => dispatch({ type: "TOGGLE", field: "showPassword" })}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                8~20자 이내, 영문 알파벳, 특수문자(!, @, #, $, %, ^, &, *) 를 1자 이상 포함해야 합니다
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호 확인</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "confirmPassword", value: e.target.value })}
                    className="w-full border rounded-md px-4 py-2 pr-10 outline-none"
                  />
                  <FiEye
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                    onClick={() => dispatch({ type: "TOGGLE", field: "showConfirmPassword" })}
                  />
                </div>
              </div>

              <button className="w-full py-3 rounded-md bg-[#4B2E1E] text-white font-semibold" onClick={handleSignUp}>
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
