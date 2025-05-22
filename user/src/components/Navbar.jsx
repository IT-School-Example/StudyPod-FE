import React from "react";
import NavbarItem from "./NavbarItem";
import AuthButtons from "./AuthButtons";

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="bg-gray-200 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <span className="text-2xl">📌</span>
        <NavbarItem text="스터디 그룹 조건 검색" />
        <NavbarItem text="공지사항&FAQ" />
        <NavbarItem text="이벤트" />
      </div>

      <AuthButtons isLoggedIn={isLoggedIn} />
    </nav>
  );
};

export default Navbar;
