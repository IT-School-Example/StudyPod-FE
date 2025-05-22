import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const AuthButtons = ({ isLoggedIn }) => {
  return isLoggedIn ? (
    <div className="flex items-center space-x-2">
      <Link to="/create-group">
        <button className="bg-[#5C2E1F] text-white px-3 py-1 rounded text-sm">
          스터디 그룹 개설하기
        </button>
      </Link>
      <Link to="/profile">
        <FaUser className="text-xl text-gray-700 cursor-pointer" />
      </Link>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <Link to="/login">
        <button className="bg-[#5C2E1F] text-white px-3 py-1 rounded text-sm">
          로그인
        </button>
      </Link>
      <Link to="/signup">
        <button className="bg-gray-400 text-white px-3 py-1 rounded text-sm">
          회원가입
        </button>
      </Link>
    </div>
  );
};

export default AuthButtons;
