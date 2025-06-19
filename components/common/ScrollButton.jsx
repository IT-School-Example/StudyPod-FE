"use client";

import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";

export default function ScrollButton({ direction = "left", onClick }) {
  const Icon = direction === "left" ? IoChevronBackOutline : IoChevronForwardOutline;
  const positionClass = direction === "left" ? "left-2" : "right-2";

  return (
    <button
      onClick={onClick}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 
        bg-white shadow p-2 rounded-full z-10 hover:bg-gray-100 transition`}
    >
      <Icon size={24} className="text-gray-800" />
    </button>
  );
}
