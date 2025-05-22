import React from "react";
import { Link } from "react-router-dom";
import NavbarItem from "./NavbarItem";
import AuthButtons from "./AuthButtons";

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="bg-gray-200 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img 
            src="/logo-icon-164x174.png" 
            alt="홈 아이콘" 
            className="w-[28.8px] h-[30px] object-contain cursor-pointer"
          />
        </Link>
        <NavbarItem text="스터디 그룹 조건 검색" to="/search" />
        <NavbarItem text="공지사항&FAQ" />
        <NavbarItem text="이벤트" />
      </div>

      <AuthButtons isLoggedIn={isLoggedIn} />
    </nav>
  );
};

export default Navbar;
