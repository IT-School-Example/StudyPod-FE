"use client";

import React, { useState, useEffect, useMemo } from "react";
import ChatRoomList from "./chatRoomList";
import ChatRoom from "./chatRoom";
import ModalButton from "@/components/modalButton";
import { useUser } from "@/context/UserContext";

export default function Chat() {
  // 여러 방 리스트
  const [rooms, setRooms] = useState([]);
  const {user} = useUser();

  const [currentRoomId, setCurrentRoomId] = useState(null);
  // const [isStudyGroup, setIsStudyGroup] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/list/${user.id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
      })
      .then((result) => {
        setRooms(result.data || []);
      })
      .catch((err) => {
        console.error("채팅방 로딩 실패:", err);
        alert("채팅방 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);



  // 마지막 메시지 시간 내림차순 정렬
  const filteredRooms = useMemo(() => {
    return (
      rooms
        .slice()
        // 만약 그룹끼리 or 1:1끼리 내림차순 하고 싶을때 사용 (그룹/1:1 필터링)
        //.filter((room) => (isStudyGroup ? room.type ==="GROUP" : room.type === "DIRECT"))
        .sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        })
    );
  }, [rooms]);

  // 현재 선택된 방 객체 찾기기
  const currentRoom = rooms.find((room) => room.id === currentRoomId);

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <div>채팅방 목록 불러오는 중...</div>
      ) : (
        <ChatRoomList
          rooms={filteredRooms}
          currentRoomId={currentRoomId}
          onSelectRoom={setCurrentRoomId}
        />
      )}

      <ModalButton />

      {currentRoomId && currentRoom && (
        <ChatRoom
          roomId={currentRoomId}
          chatRoomType={currentRoom.type} // 타입 넘겨줌
          roomName={currentRoom.name}
          onLeave={() => setCurrentRoomId(null)}
        />
      )}
    </div>
  );
}
