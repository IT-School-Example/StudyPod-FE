"use client";
import React, { useState, useEffect } from "react";
import ChatApp from "@/components/chat/chatApp";
import Modal from "../common/modal";
import { useRouter } from "next/navigation";

export default function ModalButton() {
  const [isOpen, setIsOpen] = useState(false); // 모달 열림 여부

  // 비동기 처리 중 상태가 꼬일 수 있어 함수형 업데이트를 권장함
  /*const onChangeModalStatus = () => {
    setModalStatus(!modalStatus); // 버튼 누르면 열림/닫힘 토글
  };*/

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  // 다른 페이지로 이동
  const router = useRouter();
  const redirectToOtherPage = () => {
    router.push("/chatApp");
  };

  return (
    <>
      <button
        title="modal-button"
        type="채팅 아이콘콘"
        onClick={toggleModal} // 버튼을 눌러 모달 띄우기
        className="chat"
      >
        <img
          src="./chatting.png"
          alt="채팅 아이콘"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            cursor: "pointer",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        />
      </button>
      {isOpen && (
        <Modal title="채팅모달" setModal={toggleModal}>
          <ChatApp />
          <button onClick={toggleModal}>닫기</button>
        </Modal>
      )}
    </>
  );
}
