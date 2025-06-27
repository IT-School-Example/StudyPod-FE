"use client";

import { useState } from "react";
import ChatApp from "@/components/chat/chatApp";
import { useUser } from "@/context/UserContext";
import { IoClose, IoChatbubblesOutline } from "react-icons/io5";

export default function ChatIconModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleModal = () => setIsOpen((prev) => !prev);

  if (!user || !user.id) return null;

  return (
    <>
      {/* 채팅 아이콘 버튼 */}
      <div
        onClick={toggleModal}
        title="채팅 열기/닫기"
        className="fixed bottom-5 right-5 w-[60px] h-[60px] bg-white rounded-full shadow-md cursor-pointer z-50 flex items-center justify-center hover:bg-gray-100"
      >
        <IoChatbubblesOutline size={28} />
      </div>

      {/* 모달 */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 w-[400px] h-[600px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden transition-all duration-300"
        >
          {/* 상단 헤더 */}
          <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b border-gray-300">
            <span className="font-semibold text-gray-700">💬 채팅</span>
            <button
              type="button"
              onClick={toggleModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 overflow-hidden">
            <ChatApp />
          </div>
        </div>
      )}
    </>
  );
}
