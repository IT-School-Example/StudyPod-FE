"use client";

import { useEffect, useState } from "react";
import ChatRoomList from "@/components/chat/chatRoomList";
import ChatRoom from "@/components/chat/chatRoom";
import { useUser } from "@/context/UserContext";

export default function ChatApp() {
  const { user } = useUser();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChatRooms = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-rooms/list/${user.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res.json();

      if (result.resultCode !== "OK") {
        throw new Error("API 오류: " + result.description);
      }

      const mapped = result.data.map((room) => ({
        id: room.chatRoomId,
        name: room.name,
        type: room.chatRoomType,
        lastMessage: room.lastMessage,
        opponentUsername: room.opponentUsername,
        unreadCount: room.unreadMessageCount,
      }));

      setRooms(mapped);
    } catch (err) {
      console.error("채팅방 목록 에러:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [user?.id]);

  return (
    <div className="w-full h-full flex flex-col bg-white px-6 text-black">
      <div className="flex flex-row gap-6">
        <div className="w-1/3">
          {loading ? (
            <p className="text-gray-500">채팅방 목록 불러오는 중...</p>
          ) : (
            <ChatRoomList
              rooms={rooms}
              currentRoomId={selectedRoom?.id}
              onSelectRoom={(roomId) => {
                const found = rooms.find((r) => r.id === roomId);
                setSelectedRoom(found || null);
              }}
            />
          )}
        </div>

        <div className="w-2/3">
          {selectedRoom ? (
            <ChatRoom
              roomId={selectedRoom.id}
              chatRoomType={selectedRoom.type}
              roomName={selectedRoom.name}
              onLeave={() => setSelectedRoom(null)}
            />
          ) : (
            <p className="text-gray-400">채팅방을 선택해주세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
