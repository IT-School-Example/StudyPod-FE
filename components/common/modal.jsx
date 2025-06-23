import { useEffect } from "react";
import ChatApp from "@/components/chat/chatApp";

export default function Modal({ title, onClose, childeren }) {
  // 모달 내부 클릭 시 모달 꺼짐 방지
  const preventOffModal = (event) => {
    event.stopPropagation();
  };

  // 모달이 뜬 상태에서 뒷 화면 스크롤 방지
  useEffect(() => {
    // 모달이 뜨면 body의 overflow를 hidden으로 설정
    document.body.style.overflow = "hidden";
    // 모달이 사라지면 body의 overflow를 다시 auto로 설정
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      id="모달 외부"
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center w-full h-full bg-gray-500/50"
    >
      <div
        id="모달"
        onClick={preventOffModal}
        className="bg-white-white w-1/2 rounded-md p-5"
      >
        <div className="text-gray-400">{title}</div>
        <ChatApp />
      </div>
    </div>
  );
}
