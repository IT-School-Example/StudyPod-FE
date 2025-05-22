import React from "react";
import { Link } from "react-router-dom";

const NavbarItem = ({ text, to }) => {
  return (
    <Link to={to} className="text-gray-700 hover:text-blue-600">
      {text}
    </Link>
  );
};

export default NavbarItem;