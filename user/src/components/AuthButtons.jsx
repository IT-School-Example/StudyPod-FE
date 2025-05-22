import { FaUser } from "react-icons/fa";

const AuthButtons = ({ isLoggedIn }) => {
  return isLoggedIn ? (
    <div className="flex items-center space-x-2">
      <button className="bg-[#5C2E1F] text-white px-3 py-1 rounded text-sm">
        스터디 그룹 개설하기
      </button>
      <FaUser className="text-xl text-gray-700" />
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <button className="bg-[#5C2E1F] text-white px-3 py-1 rounded text-sm">
        로그인
      </button>
      <button className="bg-gray-400 text-white px-3 py-1 rounded text-sm">
        회원가입
      </button>
    </div>
  );
};

export default AuthButtons;
